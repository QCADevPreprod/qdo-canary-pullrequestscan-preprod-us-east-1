//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express')
const app = express()

// {fact rule=improper-restriction-of-frames@v1.0 defects=1}

function x_frame_options_misconfiguartion_noncompliant() {
    app.get('/test', function (req, res) {
        res.set('X-Frame-Options', req.query.opts) //Noncompliant : It has broken `X-Frame-Options` header.
        res.send('ok')
    })
}
// {/fact}

// {fact rule=improper-restriction-of-frames@v1.0 defects=0}

function x_frame_options_misconfiguartion_compliant() {
    app.get('/ok-test', function (req, res) {
        res.set('X-Frame-Options', 'SAMEORIGIN') //Compliant : It has safe `X-Frame-Options` header.
        res.send('ok')
    })
}
// {/fact}