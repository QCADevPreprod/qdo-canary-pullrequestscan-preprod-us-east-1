/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=express_serve_static_rule@v1.0 defects=1}

function noncomplaint()
{
    // Noncomplaint: Second parameter of `serveStatic` call has `dotfiles` variable set to `allow`.
    let serveStaticMiddlewareNC = serveStatic('public', { index : false, dotfiles : 'allow' });
    app.use(serveStaticMiddlewareNC);

}
// {/fact}

// {fact rule=express_serve_static_rule@v1.0 defects=0}

function complaint(safeDomain)
{
    // Complaint: `dotfiles` variable is set to `ignore`. `ignore` and `deny` are accepted values.
    var serve = serveStatic('public/ftp', { 'index': false, 'dotfiles': 'ignore' });
    var server = http.createServer(function onRequest (req, res) {
        serve(req, res, finalhandler(req, res))
    })
}
// {/fact}