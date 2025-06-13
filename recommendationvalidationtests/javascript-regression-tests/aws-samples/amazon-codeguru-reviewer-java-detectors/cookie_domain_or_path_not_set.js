/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=cookie-domain-or-path-not-set-js-rule@v1.0 defects=1}
const cookieSession = require('cookie-session');

const express = require('express');
const app = express()

app.use(
    cookieSession({
        name: "sessionName",
        keys: ["key1", "key2"],
        // Noncompliant: `domain` and `path` attributes not set for the cookie.
        cookie: {
            httpOnly: true,
            secure: true
        }
    })
);
// {/fact}

// {fact rule=cookie-domain-or-path-not-set-js-rule@v1.0 defects=0}

app.use(
    cookieSession({
        name: "sessionName",
        keys: ["key1", "key2"],
        // Compliant: `domain` and `path` attributes have been set for the cookie.
        cookie: {
            httpOnly: true,
            secure: true,
            domain: "trusted.domain.com",
            path: "/trustedRoute"
        }
    })
);
// {/fact}

