/*
* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

const express = require('express');
const config = require('../config');
const app = express();

// {fact rule=insecure-object-attribute-modification@v1.0 defects=1}

app.put('/users/:id', (req, res) => {
    let userObj = config.USER_OBJECT;
    let userId = req.params.id;

    // Noncompliant: User-provided input being used to set object property.
    userObj[userId] = req.body.userDetails;
    res.end(200);
});

// {/fact}

// {fact rule=insecure-object-attribute-modification@v1.0 defects=0}

app.post('/users/:id', (req, res) => {
    let userObj = config.USER_OBJECT;
    let userId = req.params.id;

    // Compliant: Checks whether the property is directly owned by the object before modifying it.
    if(userObj.hasOwnProperty(userId)) {
        userObj[userId] = req.body.userDetails;
    }
    res.end(200);
});

// {/fact}