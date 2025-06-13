// {fact rule=cross-site-request-forgery@v1.0 defects=1}

function csrf_disabled_noncompliant()
{
    let csrf = require('csurf');
    let express = require('express');
    let app = express();
    //Noncompliant : Post is unsafe http methods and is added in ignored methods.
    app.use(csrf({ cookie: true, ignoreMethods: ["POST", "GET"] }));
}
// {/fact}

// {fact rule=insecure-cookie@v1.0 defects=0}

function csrf_disabled_compliant()
{
    let csrf = require('csurf');
    let express = require('express');
    let app = express();
    //Compliant : Get is a safe http methods and is added in ignored methods.
    app.use(csrf({ cookie: true, ignoreMethods: ["GET"] }));
}
// {/fact}