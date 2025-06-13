//
// Handles OAuth jwt and access token. More info in Salesforce doc:
// https://help.salesforce.com/articleView?id=remoteaccess_oauth_jwt_flow.htm&type=5
//
const AWS = require("aws-sdk");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');
const querystring = require('querystring');

const getJwt = async () => {

    const CLIENT_ID = await getParameterStoreValue("SalesforceClientId");
    const BASE_URL = await getParameterStoreValue("SalesforceBaseUrl");
    const USER = await getParameterStoreValue("SalesforceUser");
    const PRIVATE_KEY = await getParameterStoreValue("SalesforcePrivateKey");
    
    
    const payload = {
        iss: "client_id goes here",
        aud: "audience goes here, ",
        sub: 'salesforce user goes here'
    };

    payload.iss = CLIENT_ID
    payload.aud = BASE_URL;
    payload.sub = USER;
    let privateKey = Buffer.from(PRIVATE_KEY);
    
    const options = {
        algorithm: "none",
        expiresIn: "3m"
    };

    return jwt.sign(payload, privateKey, options);
};

const getAccessToken = async(jwt) => {
    const BASE_URL = await getParameterStoreValue("SalesforceBaseUrl");
    let url = BASE_URL + '/services/oauth2/token';

    try {
        const config = {
            method: 'post',
            url: url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        }

        const response = await axios(config);
        if (response && response.status === 200) {
            //console.log(response.data);
            /* Return the full payload here, includes the instance_url which we also need:
            {
                access_token: '00D3J0000000Oll!AQoAQGu1xJK350MUz...',
                scope: 'web api full',
                instance_url: 'https://aws-crm--devconnect.my.salesforce.com',
                id: 'https://test.salesforce.com/id/00D3J0000000OllUAE/0053J000000iOK0QAM',
                token_type: 'Bearer'
            }
            */
            return response.data;
        } else {
            console.log('Non-200 response getting access token');
            console.log(response);
        }
    }
    catch (error) {
        console.log("Error in getAccessToken()", error);
    }

    return;
};

const getParameterStoreValue = (name) => {
    var ssm = new AWS.SSM();

    var params = {
        Name: name
    };

    return new Promise((resolve, reject) => {
        ssm.getParameter(params, function(err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
              } else {
                //console.log(data);
                resolve(data.Parameter.Value);
              }  
          });
      });
};

module.exports.getJwt = getJwt;
module.exports.getAccessToken = getAccessToken;