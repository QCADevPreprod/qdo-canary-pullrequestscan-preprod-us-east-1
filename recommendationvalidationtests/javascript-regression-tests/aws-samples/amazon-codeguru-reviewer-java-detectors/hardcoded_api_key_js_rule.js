/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=hardcoded-api-key-js-rule@v1.0 defects=1}
const express = require('express');
const app = express()

app.get("/api/someurl", function(req, res) {
    // API key is hard-coded
    const apiKey = "91f850ce-4b09-46f7-a52e-fd96c36b5201";

    if ( req.query.key === apiKey ) {
        doSomething();
    } else {
        res.status(401).send("unauthorized");
    }
});
// {/fact}

// {fact rule=hardcoded-api-key-js-rule@v1.0 defects=0}

app.get("/api/someurl", function (req, res) {
    if ( req.query.apiKey === process.env.API_KEY ) {
        doSomething();
    } else {
        res.status(401).send("unauthorized");
    }
});
// {/fact}