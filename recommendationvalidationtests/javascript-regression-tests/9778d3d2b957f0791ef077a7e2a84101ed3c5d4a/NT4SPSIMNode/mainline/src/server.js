const express = require('express');
const path = require('path');
const compression = require('compression');
const psimAuthMiddleware = require('./middleware/psimAuthMiddleware');
const apolloEnvironmentInfo = new require('apollo-environment-info')();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware').default;
const webpackHotMiddleware = require('webpack-hot-middleware');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const https = require('https');

const { getJwtSecretKey, getPSIMCert } = require('./util/odinUtil');
const global_config = require('./config/application');
const PSIMGeneralConstants = require('../dev_src/app/constants/PSIMGeneralConstants');

const HTTP_SERVER_OPCONFIG = apolloEnvironmentInfo.getOperationalConfig('HttpServer') || {};
// const HTTP_REGULAR_PORT = Number(HTTP_SERVER_OPCONFIG.httpRegularPort);
const HTTP_SECURE_PORT = Number(HTTP_SERVER_OPCONFIG.httpSecurePort);

const HTTP_SERVER_NAME = HTTP_SERVER_OPCONFIG.httpServerName || "";
const isDevelopment = HTTP_SERVER_NAME.startsWith("dev-dsk") || HTTP_SERVER_NAME.includes('.aka.');

// Todo: Remove after the Cognito CM
// This is bad and should be removed when we solve
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
let jwtSecretKey = null;

(async () => {
    try {
        jwtSecretKey = await getJwtSecretKey();
        await setupSecurePortServer();
    } catch (err) {
        console.error("[ERROR] Error in start PSIM service.", err);
        return;
    }
})();

app.use(psimAuthMiddleware);

const heatMapIntentAuthorization = async (token) => {
    let url = `${global_config.get('WorkflowEngine').endpoint}/heatMap/auth?token=${token}`;
    return await fetch(url, {
        method: "GET",
        mode: "cors",
    });
};

app.get('/assets/js/configs.js', function (req, res) {
    const psimEndpoint = `https://${HTTP_SERVER_NAME}${isDevelopment ? ':' + HTTP_SECURE_PORT : ''}`;
    const configs = {
        endpoint: psimEndpoint,
        workflowEngineEndpoint: global_config.get('WorkflowEngine').endpoint,
        emtEndpoint: global_config.get('EMT').endpoint,
        phoneToolUrl: global_config.get('phonetool').URL,
        facmanEndpoint: global_config.get('FacMan.V2').endpoint,
        appSyncConfig: global_config.get('AppSync').config,
        psimAuthConfig: global_config.get('PSIMAuth')
    };

    res.send('var psimConfigs = ' + JSON.stringify(configs));
});

app.get('/assets/js/psimJwtToken.js', function (req, res) {
    var username = req.identity && req.identity.username;
    var jwtToken = jwt.sign({user: username, intent: PSIMGeneralConstants.PSIM_INTENT}, jwtSecretKey, {expiresIn: '1m'});
    res.send(jwtToken);
});

app.get('/assets/js/psimonsiteJwtToken.js', function (req, res) {
    var username = req.identity && req.identity.username;
    var jwtToken = jwt.sign({user: username, intent: PSIMGeneralConstants.ONSITE_INTENT}, jwtSecretKey, {expiresIn: '1m'});
    res.send(jwtToken);
});

app.get('/assets/js/actionItemsJwtToken.js', function (req, res) {
    var username = req.identity && req.identity.username;
    var jwtToken = jwt.sign({user: username, intent: PSIMGeneralConstants.ACTION_ITEM_INTENT}, jwtSecretKey, {expiresIn: '1m'});
    res.send(jwtToken);
});

app.get('/assets/js/siteMonitorJwtToken.js', function (req, res) {
    let username = req.identity && req.identity.username;
    let jwtToken = jwt.sign({user: username, intent: "siteMonitor"}, jwtSecretKey, {expiresIn: '1m'});
    res.send(jwtToken);
});

app.get('/assets/js/heatMapAuthenticationJwtToken.js', async function (req, res) {
    var username = req.identity && req.identity.username;
    var jwtToken = jwt.sign({user: username, intent: PSIMGeneralConstants.HEAT_MAP_INTENT}, jwtSecretKey, {expiresIn: '1m'});
    try {
        let response = await heatMapIntentAuthorization(jwtToken);
        switch(response.status) {
            case 200:
                res.status(200).send(await response.text());
                break;
            case 401:
                res.sendStatus(401);
                break;
            default:
                throw err;
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/assets/js/deviceTagAuthJwtToken.js', async function (req, res) {
    const username = req.identity && req.identity.username;
    const jwtToken = jwt.sign({ user: username, intent: PSIMGeneralConstants.DEVICE_TAG_INTENT }, jwtSecretKey, { expiresIn: '10h' });
    res.send(jwtToken);
});

app.get("/getHeader", function (req, res) {
    var username = req.identity && req.identity.username;
    res.json({ username: username});
});

app.get("/ping", function (req, res) {
    res.send('Layer 7 HealthCheck Success');
});

app.get("/sping", function (req, res) {
    res.send('Layer 7 HealthCheck Success');
});

if (isDevelopment) {
    const webpackConfig = require('../webpack.dev.config.js');
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        index: "./index.html",
        serverSideRender: true,
        headers: { "Access-Control-Allow-Origin": "https://localhost:4000", "Access-Control-Allow-Credentials": "true" }
    }));
    app.use(webpackHotMiddleware(compiler));

    app.get('*', function response(req, res) {
        const { devMiddleware: { outputFileSystem } } = res.locals.webpack;
        __dirname = req.body.path;
        res.write(outputFileSystem.readFileSync(path.resolve(__dirname, '../dist/index.html')));
        res.end();
    });
} else {
    app.use(compression({ threshold: '10kB' }));
    app.use('/assets', express.static(path.resolve(__dirname, '../dist')));
    app.get('*', function response(req, res) {
        res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    });
}

const setupSecurePortServer = async () => {
    const { key, cert } = await getPSIMCert();
    https.createServer({ key, cert }, app).listen(HTTP_SECURE_PORT, function () {
        console.log('Amazon PSIM app listening at', HTTP_SECURE_PORT);
    });
};