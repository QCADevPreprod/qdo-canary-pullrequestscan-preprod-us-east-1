const https = require("https");

// {fact rule=verify_hostname_js_rule@v1.0 defects=1}
function nonCompliant() {
    const options = {
        hostname: 'encrypted.google.com',
        port: 443,
        path: '/',
        method: 'GET',
        checkServerIdentity: function() {
            console.log('unverified hostname');
        } // Noncompliant: hostname is not verified
    };

    const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });
}
// {/fact}

// {fact rule=verify_hostname_js_rule@v1.0 defects=0}
function compliant() {
    const options = {
        hostname: 'github.com',
        port: 443,
        path: '/',
        method: 'GET',
        checkServerIdentity: function(host, cert) {
            // Make sure the certificate is issued to the host we are connected to
            if (host != "github.com") {
                return err;
            }
        }
    }
    const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });
}
// {/fact}