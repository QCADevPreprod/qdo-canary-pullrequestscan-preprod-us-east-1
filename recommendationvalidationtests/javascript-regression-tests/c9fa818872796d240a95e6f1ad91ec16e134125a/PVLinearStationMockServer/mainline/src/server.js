const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');

const config = require('./config/config.js');

const app = express();
const port = 3000;

function readFileBody(fileLocation) {
    return fs.readFileSync(fileLocation, { encoding: 'utf8' });
}

const routes = global.gRoutes.paths;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/test', (req, res) => {
    let id_ = req.query.id;
    str1 = id_ + `
        <form method="POST" style="margin: 60px auto; width: 140px;">
            <p><input name="username" type="text" /></p>
            <p><input name="password" type="password" /></p>
            <p><input value="Login" type="submit" /></p>
        </form>
        `
    res.send(str1);
});

app.post('*', (req, res) => {
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    try {
        let found = false;
        const body = JSON.stringify(req.body);

        for (let i = 0; i < routes.post.length; i += 1) {
            const route = routes.post[i];
            if (req.url.includes(route.uri)) {
                for (let j = 0; j < route.searchTerms.length; j += 1) {
                    const routeInfo = route.searchTerms[j];
                    if (body.includes(routeInfo.searchWord)) {
                        found = true;
                        const response = readFileBody(routeInfo.path);
                        res.send(response);
                        return;
                    }
                }
            }
        }

        if (!found) {
            res.status(404).send({ error: `${routes} does not have a mapping for request ${body}` });
        }
    } catch (e) {
        console.log(e.toString());
        res.status(500).send({ error: e.toString() });
    }
});

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(`Configuration: ${JSON.stringify(config, null, 4)}`);
});

module.exports = httpServer;