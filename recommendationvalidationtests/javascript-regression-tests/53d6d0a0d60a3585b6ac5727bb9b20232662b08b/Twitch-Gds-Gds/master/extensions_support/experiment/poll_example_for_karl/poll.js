'use strict';

const express = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, twitchextsessionjwt');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});

app.use((req, res, next)=>{
    console.log('Got request', req.path, req.method);
    return next();
});

app.use((req, res, next)=>{
    if(req.method != 'OPTIONS' && req.path != '/debug/helpers') {
        try {
            let key = process.env.POLL_EXTENSION_SECRET;
            req.decryptedBlock = jwt.verify(req.headers.twitchextsessionjwt,key);
        }
        catch(e) {
            console.log('JWT failure', e);
            res.writeHead(403);
            res.end();
        }
    }
    return next();
});

// In a real implementaiton poll would be backed by a database
// and there might be many edges of this service running on the backend
// For now, no database, "polls" is global.

let polls = {}

app.get('/api/v1/poll/:id', (req,res)=>{
    res.send(polls[req.params.id]);
});

app.post('/api/v1/poll/:id/vote', (req,res)=>{
    polls[req.params.id].counts[req.body.answer] += 1;

    // In a real implemention this would use the user id in the
    // req.decryptedBlock to prevent user from voting more than once

    broadcastPoll(req.params.id,req);
    res.send({ success: true });

});

function makePollFromReq( req ) {
    let poll = {
        question: req.body.question,
        responses: [],
        counts: [],
    };
    let responses = req.body.responses.split('\n');
    for(let i in responses) {
        poll.responses.push(responses[i].trim());
        poll.counts.push(0);
    }
    return poll;
}

app.put('/api/v1/poll/:id', (req,res)=>{
    if(req.decryptedBlock.userId == req.decryptedBlock.channelId) {
        // Only the broadcaster should be allowed to modify a poll
        polls[req.params.id] = makePollFromReq(req);
        broadcastPoll(req.params.id,req);
        res.send( polls[req.params.id] );
    }
});

function broadcastPoll(id,req) {
    // A performant version of this would accumulate broadcasts

    const sharedJwtPayload = {
        channel: id,
        extName: 'poll',
    }

    const sharedSecret = new Buffer(process.env.POLL_EXTENSION_SECRET).toString('base64');
    const sharedJwt = jwt.sign(sharedJwtPayload, sharedSecret);

    const pollReply = {
        pollId: id,
        poll: polls[id]
    }

    request.post(
        {
            url: process.env.EXTENSIONS_PUBSUBPROXYHOST + '/api/v1/pubsub',
            json: {
                broadcast: true,
                data: JSON.stringify(pollReply)
            },
            headers: {
                twitchsharedjwt: sharedJwt,
                twitchextname: 'poll',
            }
        },
        (error, response, body)=>{
            if( error ) {
                console.log('Broadcast error', error);
            }
        }
    );
}