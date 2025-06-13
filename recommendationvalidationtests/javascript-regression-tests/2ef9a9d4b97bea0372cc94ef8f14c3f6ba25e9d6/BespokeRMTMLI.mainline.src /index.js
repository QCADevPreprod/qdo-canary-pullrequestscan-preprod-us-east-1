const AWS = require('aws-sdk');
const http = require('http');
const interceptor = require('midway-lambda-interceptor');
const urllib = require('urllib');

const lambda = new AWS.Lambda();

AWS.config.update({
    stsRegionalEndpoints: 'regional'
});
exports.handler = interceptor.makeInterceptor(main);
global.Buffer = global.Buffer || require('buffer').Buffer;
if (typeof btoa === 'undefined') {
    global.btoa = function (str) {
        return Buffer.from(str, 'utf-8').toString('base64');
    };
}

if (typeof atob === 'undefined') {
    global.atob = function (b64Encoded) {
        return Buffer.from(b64Encoded, 'base64').toString('utf-8');
    };
}

function main(event, context, lambdaCallback) {
    // Log details
    console.log("event: " + JSON.stringify(event, null, 2));
    console.log("process.env: " + JSON.stringify(process.env, null, 2));

    const error = {
        statusCode: 403,
        headers: {
            'Access-Control-Allow-Origin': process.env.IDENTITY_PROVIDER,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: '403 Forbidden',
        isBase64Encoded: false,
    };

    const auth = event.headers['X-CLIENT-VERIFY'];
    console.log(auth);
    if (auth !== 'SUCCESS') {
        console.log('Midway verification failed');
        lambdaCallback(null, error);
        return;
    }

    const users = new Set([
        'abrownhh',
        'alepay',
        'cjustini',
        'hamtim',
        'jamesfp',
        'jaschoi',
        'johnckan',
        'jtknow',
        'leewn',
        'seanok',
    ]);
    const username = event.headers['X-FORWARDED-USER'];
    console.log(username);
    if (!users.has(username)) {
        console.log('Unauthorized user');
        lambdaCallback(null, error);
        return;
    }

    //return invokeRmtLambda(event, context, lambdaCallback);
    return invokeRmtEc2(event, context, lambdaCallback);
}

// Invoke the RMT lambda, return its payload to API Gateway
function invokeRmtLambda(event, context, lambdaCallback) {
    if (!process.env.INVOKE_ARN) {
        console.error('Missing environment variable INVOKE_ARN');
        return done(500, '{"message":"internal server error"}', 'application/json', lambdaCallback);
    }
    const params = {
        FunctionName: process.env.INVOKE_ARN,
        Payload: JSON.stringify(event),
    };
    console.log("params: " + JSON.stringify(params));
    lambda.invoke(params, (err, data) => {
        // Let Jets Lambda handle errors
        console.log("Calling Jets Lambda");
        console.log("err: " + err);
        console.log("data: " + data);
        console.log("JSON.stringify(data): " + JSON.stringify(data));
        lambdaCallback(err, JSON.parse(data.Payload));
    });
}

// Send a request to the RMT EC2 instance, return its payload to API Gateway
function invokeRmtEc2(event, context, lambdaCallback) {
    let url = 'http://ec2-3-32-33-84.us-gov-west-1.compute.amazonaws.com:3000'
    console.log(`Base URL: ${url}`);

    // Add proxy resource path to urllib request path
    console.log(`event.path: ${event.path}`);
    if (typeof event.path !== 'undefined') {
        url += event.path;
    }
    console.log(`Target URL: ${url}`);

    let options = {
        method: event.httpMethod,
        dataType: 'text',
        headers: event.headers,
        keepHeaderCase: true,
        followRedirect: true
    };
    if (event.body !== null) {
        if (event.isBase64Encoded) {
            options.data = atob(event.body);
        } else {
            options.data = event.body;
        }
    }
    console.log(`urllib.request options: ${options}`);
    console.log(`urllib.request options (str): ${JSON.stringify(options)}`);

    urllib.request(
        url,
        options,
        (err, data, res) => {
            console.log(`res (str): ${JSON.stringify(res)}`);
            console.log(`res.statusCode: ${res.statusCode}`);
            console.log(`res.headers: ${res.headers}`);
            console.log(`res.headers (str): ${JSON.stringify(res.headers)}`);
            if (err) {
                console.log(`err: ${err}`);
                console.log(`err (str): ${JSON.stringify(err)}`);
            } else {
                console.log(`data: ${data}`);
                console.log(`data (str): ${data.toString()}`);
                res.headers['Access-Control-Allow-Credentials'] = true;
                res.headers['Access-Control-Allow-Headers'] = '*';
                res.headers['Access-Control-Allow-Origin'] = '*';
                if (typeof res.headers['set-cookie'] !== 'undefined'
                    && res.headers['set-cookie'].length > 0) {
                    res.headers['set-cookie'] = res.headers['set-cookie'][0];
                }
                console.log(`res.headers (str): ${JSON.stringify(res.headers)}`);
                lambdaCallback(null, {
                    statusCode: res.statusCode,
                    isBase64Encoded: false,
                    body: data.toString(),
                    headers: res.headers
                });
            }
        }
    );
}

// We're done with this lambda, return to the client with given parameters
function done(statusCode, body, contentType, lambdaCallback, isBase64Encoded = false) {
    lambdaCallback(null, {
        statusCode,
        isBase64Encoded,
        body,
        headers: {
            'Content-Type': contentType
        },
    });
}