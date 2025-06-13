const express = require('express')
const app = express()
const https = require("https");
const fs = require("fs")
const dns = require('dns')

const port = 3001

const options = {
    key: fs.readFileSync("cert/key.pem"),
    cert: fs.readFileSync("cert/cert.pem"),
};

const COOKIE_OPTIONS = { sameSite: 'None', secure: true, httpOnly: true };

app.post('/doNothingDomain2', (req, res) => {
    console.log("/doNothingDomain2");
    console.log(JSON.stringify(req.headers));
    res.send('doNothingDomain2');
})

app.post('/setCookieForDomain2', (req, res) => {
    console.log("/setCookieForDomain2 ");
    console.log(JSON.stringify(req.headers));
    res.cookie("domain2", "1", COOKIE_OPTIONS);
    res.send('the cookie domain2 should be set for Domain2');
})

function isSameDomain() {
    const myArgs = process.argv.slice(2);
    return myArgs.length >= 1 && myArgs[0] === "same-domain"
}

async function getIP(hostname) {
    let obj = await dns.promises.lookup(hostname).catch((error)=> {
        console.error(error);
    });
    return obj?.address;
}

app.get('/getHostLocation', async (req, res) => {
    let hostLocation;
    if (isSameDomain()) {
        hostLocation = `https://dev-dsk-${process.env.USER}.aka.amazon.com:3000`
    } else {
        const ip = await getIP(process.env.HOSTNAME)
        hostLocation = `https://${ip}:3000`
    }
    res.send(hostLocation);
})

app.use(express.static(__dirname + '/www'))

https.createServer(options, app)
    .listen(port, function () {
        console.log(`domain2 can be accessed at https://dev-dsk-${process.env.USER}.aka.amazon.com:${port}`)
    });