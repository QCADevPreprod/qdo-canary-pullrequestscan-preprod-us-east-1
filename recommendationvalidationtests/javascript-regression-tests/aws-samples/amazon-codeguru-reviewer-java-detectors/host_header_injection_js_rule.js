//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express')
const app = express()

// {fact rule=improper-input-validation@v1.0 defects=1}

function host_header_injection_noncompliant() {
    app.get('/', function (req, res) {
        var reset_url = 'https://' + req.host + '/password_reset'; //Noncompliant : `req.host` is amended on url.
    })
}
// {/fact}

// {fact rule=improper-input-validation@v1.0 defects=0}

function host_header_injection_compliant() {
    app.get('/ok', async (req, res) => {
        if (req.host === 'forsale.corp.amazon.com') { //Compliant : `req.host` is comparing with a trusted url.
            res.redirect(301, 'https://' + req.host + req.url);
        } else {
            next();
        }
    })
}
// {/fact}