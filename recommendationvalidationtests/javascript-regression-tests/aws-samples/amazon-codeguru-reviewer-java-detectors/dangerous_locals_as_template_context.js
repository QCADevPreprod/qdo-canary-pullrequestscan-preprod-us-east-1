const express = require("express");
const app = express();

// {fact rule=dangerous_locals_as_template_context_js_rule@v1.0 defects=1}

function noncompliant()
{
    app.get('/', (req, res) => {
        // Noncompliant: Using `app.locals` as template context is security sensitive
        return res.render("index", app.locals);
    });
}
// {/fact}

// {fact rule=dangerous_locals_as_template_context_js_rule@v1.0 defects=0}

function compliant()
{
    app.get('/', (req, res) => {
        // Compliant: Using `res.locals` as template context is safe
        return res.render("index", res.locals);
    });
}
// {/fact}