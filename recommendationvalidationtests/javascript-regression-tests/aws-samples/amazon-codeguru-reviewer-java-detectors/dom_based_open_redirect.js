// {fact rule=dom_based_open_redirection_js_rule@v1.0 defects=1}

function noncompliant()
{
    let url = document.location.hash.slice(1);
    // Noncompliant: Redirected to untrusted URL without sanitization or validation.
    document.location = url;
}
// {/fact}

// {fact rule=dom_based_open_redirection_js_rule@v1.0 defects=0}

function compliant(safeDomain)
{
    let url = document.location.hash.slice(1);
    // Compliant: Untrusted URL is validated before redirection.
    if(url.startsWith(safeDomain)){
        document.location = url;
    }
}
// {/fact}