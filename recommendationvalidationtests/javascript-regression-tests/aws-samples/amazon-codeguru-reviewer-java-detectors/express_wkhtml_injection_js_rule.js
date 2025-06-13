//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express')
const app = express()
const wkhtmltopdf = require('wkhtmltopdf');

// {fact rule=server-side-request-forgery@v1.0 defects=1}

 function express_wkhtml_injection_noncompliant() {
    app.get('/', async function(req, res) {
        const pdf = wkhtmltopdf(req.query.q, { output: 'vuln.pdf' }) //Noncompliant : `wkhtmltopdf` uses untrusted HTML.
        res.send(pdf)
    })
 }
// {/fact}

// {fact rule=server-side-request-forgery@v1.0 defects=0}

 function express_wkhtml_injection_compliant() {
    app.post('/ok', async (req, res) => {
        const pdf = wkhtmltopdf('<html></html>', { output: 'vuln.pdf' }) //Compliant : `wkhtmltopdf` uses trusted HTML.
        res.send(pdf)
    })
 }
// {/fact}