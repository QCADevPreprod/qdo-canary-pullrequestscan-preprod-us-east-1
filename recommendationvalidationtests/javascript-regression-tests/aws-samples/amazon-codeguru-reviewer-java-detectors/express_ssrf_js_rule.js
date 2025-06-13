//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express')
const app = express()
const request = require('request')

// {fact rule=server-side-request-forgery@v1.0 defects=1}

function express_ssrf_noncompliant() {
    app.get('/', (req, res) => {
        const url = req.body.imageUrl;
        request.get(url) // Noncompliant : used user-provided URL to make a request
    })
}
// {/fact}

// {fact rule=server-side-request-forgery@v1.0 defects=0}

function express_ssrf_compliant() {
    app.get('/', (req, res) => {
        const url = 'https://google.com'; //Compliant : the url is not user-provided
        request.get(url)
    })
}
// {/fact}