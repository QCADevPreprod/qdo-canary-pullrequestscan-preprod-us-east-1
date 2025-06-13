/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=always_verify_ssl_certifactes@v1.0 defects=1}
const tls = require("tls");
const fs = require("fs");

function always_verify_ssl_certifactes_noncompliant()
{
    const options = {
        host: 'encrypted.abcd.com',
        // Noncompliant: rejectUnauthorized is set to 'false'
        rejectUnauthorized: false
    };

    tls.createServer(options, (req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);
}
// {/fact}

// {fact rule=always_verify_ssl_certifactes@v1.0 defects=0}

function always_verify_ssl_certifactes_compliant()
{
    const options = {
        // Compliant: certificate is provided
        key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
        cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    };

    tls.createServer(options, (req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);
}
// {/fact}

