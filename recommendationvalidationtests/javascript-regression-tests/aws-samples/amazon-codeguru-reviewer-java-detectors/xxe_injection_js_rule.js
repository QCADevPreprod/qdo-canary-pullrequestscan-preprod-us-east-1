//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express')
const app = express()
const expat = require('node-expat');

// {fact rule=xxe_injection_js_rule@v1.0 defects=1}

 function xxe_injection_noncompliant() {
    app.get('/test', async (req, res) => {
        var parser = new expat.Parser('UTF-8')
        parser.write(req.body) // Noncompliant : parsing user-controlled data
        res.send('Hello World!')
    })
 }
// {/fact}

// {fact rule=xxe_injection_js_rule@v1.0 defects=0}

 function xxe_injection_compliant() {
    app.get('/test', async (req, res) => {
        var parser = new expat.Parser('UTF-8')
        parser.write('<xml>hardcoded</xml>') //Compliant : parsing xml tag
        res.send('Hello World!')
    })
 }
// {/fact}