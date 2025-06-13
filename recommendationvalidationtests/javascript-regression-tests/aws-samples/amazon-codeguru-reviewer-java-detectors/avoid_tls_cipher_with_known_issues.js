const https = require('https');
// {fact rule=avoid_tls_cipher_with_known_issues@v1.0 defects=1}
function non_conformant1(){
    var ciphers = [`TLS_DH_anon_WITH_AES_256_GCM_SHA384`,
        `TLS_AES_128_GCM_SHA256`,
        `ECDHE-ECDSA-AES128-GCM-SHA256`].join(':');
    let options = {
        hostname: 'www.example.com',
        port: 443,
        path: '/',
        method: 'GET',
        secureProtocol: 'TLSv1_2_method',
        ciphers:ciphers
    };

    let req = https.request(options, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });
    console.log(req);
}

// {/fact}

// {fact rule=avoid_tls_cipher_with_known_issues@v1.0 defects=0}

function conformant4(){
    var ciphers = [`TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256` ,
        `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`,
        `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`,
        `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`,
        `TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256`,
        `TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256`,
        `TLS_AES_128_GCM_SHA256`,
        `TLS_AES_256_GCM_SHA384`,
        '!aNULL',
        '!eNULL',
        '!NULL',
        '!DES',
        '!RC4',
        '!MD5'].join(':');
    tls.connect({
        host: 'example.com',
        port: 443,
        secureProtocol: 'TLSv1_2_method',
        ciphers: ciphers
    }, function() {
        console.log("secure");
    }).on('error', function(err) {
        console.log("error");
    });
}

// {/fact}
