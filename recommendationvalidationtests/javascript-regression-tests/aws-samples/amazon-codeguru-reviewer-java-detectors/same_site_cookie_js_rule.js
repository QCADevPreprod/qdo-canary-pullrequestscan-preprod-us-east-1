/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=same-site-cookie@v1.0 defects=1}
const express = require('express')
const app = express()

function same_site_cookie_noncompliant()
{
    app.get("/", (req, res) => {
        // Noncompliant: sameSite is set to 'none'
        res.cookie('test', 'abc', { sameSite: 'none', secure: true });
        res.render("index.html");
    });
}
// {/fact}

// {fact rule=same_site_cookie@v1.0 defects=0}

function same_site_cookie_compliant()
{
    app1.get("/", (req, res) => {
        // Compliant: sameSite is set to 'lax'
        res.cookie('test', 'abc', { sameSite: 'lax', secure: true });
        res.render("index.html");
    });
}
// {/fact}

