//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express');
const app = express();

// {fact rule=log_injection_js_rule@v1.0 defects=1}
function non_compliant()
{
    app.get("/query", function (req, res) {
        // console.log(req.body.id);
    })
}
// {/fact}

// {fact rule=log_injection_js_rule@v1.0 defects=0}
function compliant()
{
    app.get("/query", function (req, res) {
        console.log(sanitize(req.body.id));
    })
}
// {/fact}