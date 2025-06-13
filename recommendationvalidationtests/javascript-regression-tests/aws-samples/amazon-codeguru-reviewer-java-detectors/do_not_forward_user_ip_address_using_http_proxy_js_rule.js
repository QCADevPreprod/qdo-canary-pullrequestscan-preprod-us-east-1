const http = require('http')
const httpProxy = require('http-proxy')

// {fact rule=sensitive-information-leak@v1.0 defects=1}

function do_not_forward_user_ip_address_using_http_proxy_non_compliant()
{
    let options = {
        secure: false,
        changeOrigin: true,
        // Noncompliant: `xfwd` is set to true, which enables client IP forwarding.
        xfwd: true
    }
    const proxy = httpProxy.createProxyServer(options)
    http.createServer(function(req, res) {
        proxy.web(req, res, { target: 'http://dummy-target.com' });
    });
}
// {/fact}

// {fact rule=sensitive-information-leak@v1.0 defects=0}

function do_not_forward_user_ip_address_using_http_proxy_compliant()
{
    let options = {
        secure: false,
        changeOrigin: true
    }
    // Compliant: Client IP forwarding is disabled, as `xfwd` by default set to false.
    const proxy = httpProxy.createProxyServer(options)
    http.createServer(function(req, res) {
        proxy.web(req, res, { target: 'http://dummy-target.com' });
    });
}
// {/fact}

