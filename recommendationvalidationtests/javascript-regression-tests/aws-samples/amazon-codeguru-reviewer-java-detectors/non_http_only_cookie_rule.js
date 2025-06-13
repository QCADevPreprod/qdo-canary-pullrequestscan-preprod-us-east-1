// {fact rule=insecure-cookie@v1.0 defects=1}

function http_cookie_noncompliant()
{
    const cookieSession = require('cookie-session');
    let session = cookieSession({
        secret: "secret",
        // Noncompliant: The http flag is set to false.
        httpOnly: false,
    });
}
// {/fact}

// {fact rule=insecure-cookie@v1.0 defects=0}

function http_cookie_compliant()
{
    const cookieSession = require('cookie-session');
    let session = cookieSession({
        secret: "secret",
        // Compliant: The http flag is set to true.
        httpOnly: true,
    });
}
// {/fact}

