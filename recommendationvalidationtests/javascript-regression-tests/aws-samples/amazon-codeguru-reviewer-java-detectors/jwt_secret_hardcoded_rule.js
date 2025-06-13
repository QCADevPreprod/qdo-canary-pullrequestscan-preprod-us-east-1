/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=express_serve_static_rule@v1.0 defects=1}
const jwt = require('jsonwebtoken');
function noncomplaint()
{
    // Noncomplaint: secret is hardcoded.
    var secret = "abcd";
    jwt.sign(payload, secret);

}
// {/fact}

// {fact rule=express_serve_static_rule@v1.0 defects=0}
const jwt = require('jsonwebtoken');
function complaint(safeDomain)
{
    // Complaint: secret is properly loaded from environment variables.
    var secret = process.env.JWT_TOKEN_SECRET;
    jwt.sign(payload, secret);

}
// {/fact}