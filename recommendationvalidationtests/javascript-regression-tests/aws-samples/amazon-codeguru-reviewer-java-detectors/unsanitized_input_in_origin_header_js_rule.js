//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require("express");
const app = express();

// {fact rule=unsanitized_input_in_origin_header_js_rule@v1.0 defects=1}

function unsanitized_input_in_origin_header_noncompliant() {
    app.post('/test', function (req, res) {
        const origin = req.query.origin;
        res.set(200, { 'Access-Control-Allow-Origin': origin }); // Noncompliant : origin is user-controlled data
    });
}

// {/fact}

// {fact rule=unsanitized_input_in_origin_header_js_rule@v1.0 defects=0}

function unsanitized_input_in_origin_header_compliant() {
    app.post('/test', function (req, res) {
        const origin = req.query.origin;
        res.set(200, { 'Access-Control-Allow-Origin': 'trustedwebsite.com' }); //Compliant : origin is trusted website
    });
}

// {/fact}