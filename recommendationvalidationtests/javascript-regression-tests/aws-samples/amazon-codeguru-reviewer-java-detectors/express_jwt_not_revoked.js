/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=express_jwt_not_revoked_rule@v1.0 defects=1}
const express = require('express');
var jwt = require('express-jwt');
const app = express();

// Noncomplaint: Second parameter `jwt` should have `isRevoked` varible.
app.get('/some_url', jwt({secret: process.env.SECRET}), function (req, res) {
    if (!req.user.admin) return res.sendStatus(401);
    res.sendStatus(200);
});
// {/fact}

// {fact rule=express_jwt_not_revoked_rule@v1.0 defects=0}
// Complaint: `jwt` have `isRevoked` varible.
app.get('/ok-protected', jwt({ secret: process.env.SECRET, isRevoked: blacklist.isRevoked }), function(req, res) {
    if (!req.user.admin) return res.sendStatus(401);
    res.sendStatus(200);
});

// {/fact}