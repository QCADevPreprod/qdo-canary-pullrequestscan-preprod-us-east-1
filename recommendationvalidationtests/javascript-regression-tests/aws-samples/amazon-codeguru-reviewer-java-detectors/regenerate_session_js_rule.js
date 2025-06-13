//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=session-fixation@v1.0 defects=1}
function regenerate_session_noncompliant()
{
    const express = require('express');
    const passport = require('passport');
    const app = express();
    app.post('/somepage',
        passport.authenticate('local', { failureRedirect: '/somepage' }),
        function(req, res) {
            // NonCompliant : session.regenerate is absent.
            res.redirect('/');
        });
}
// {/fact}


// {fact rule=session-fixation@v1.0 defects=0}
function regenerate_session_compliant()
{
    const express = require('express');
    const passport = require('passport');
    const app = express();
    app.post('/somepage',
        passport.authenticate('local', { failureRedirect: '/somepage' }),
        function(req, res) {
            // Compliant - session.regenerate is used
            req.session.regenerate((err) => {
            });
        });
}
// {/fact}

