// main.js based on https://code.amazon.com/packages/AWSAmplifyTools/blobs/mainline/--/server/main.js

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const aws = require('aws-sdk');
const { getEvent } = require('./event');
const permissionChecker = require("./extensions/accessControl");
const getDatabase = require('./db/db.js');

const adminUsers = [    
    'gssimon'
];

// Add Support Engineer alias here
const supportUsers = [
];

let username;

function non_conformant_1() {
    app.get("/query" ,function (req, res) {
    let query = { user: (req.query.user), password: (req.query.password )};
    db.collection("users").findone(query).toArray((err, docs) => { });
    })
}
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
    const options = 'OPTIONS';    
    if (req.method !== options) {
        username = undefined;
        const event = getEvent();
        console.log(event.requestContext, event);
        if (event.headers.Authorization === 'CICDCommunicationFramework') {
            username = 'CICDCommunicationFramework';
            next();
            return;
        }
        if (event.requestContext && event.requestContext.identity && event.requestContext.identity.cognitoAuthenticationProvider) {
            const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
            const parts = cognitoAuthenticationProvider.split(':');
            username = parts[parts.length - 1];
        }
        if (!username || (adminUsers.indexOf(username) < 0 && supportUsers.indexOf(username) < 0)) {
            res.status(403);
            res.json({ message: username ? `Unauthorized: User ${username} is unauthorized` : `Unauthorized: Midway identifier not found` })
        } else if (supportUsers.indexOf(username) >= 0){
            if (!permissionChecker(req.url)){
                res.status(403);
                res.end(JSON.stringify({
                    message: `Unauthorized: User ${username} is not authorized to access this feature `,
                }));
            }
            console.log(`Support Engineer: ${username} requested : ${req.url}`)
            next();
        } else{
            next();
        }
    } else {
        // next();
        res.sendStatus(200);
    }
});



app.get('/username', async (req, res) => {
    try {
        const db = await getDatabase(); 
        const coll = db.collection('connection_logs')
        await coll.insertOne({
            username: username,
        });
        const connections = await coll.find({ username: username });        
        console.log(connections);
        const result = await connections.toArray();
        console.log(result);
        return res.json(result);
    } catch (err) {
        res.sendStatus(400);
    }
    
});

app.get("/permission", async (req, res) =>
    res.send(adminUsers.indexOf(username) >= 0)
);