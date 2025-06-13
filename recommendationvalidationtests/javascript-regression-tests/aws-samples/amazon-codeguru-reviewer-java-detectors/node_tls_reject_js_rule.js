//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=lack-of-tls-cert-verification@v1.0 defects=1}

function node_tls_reject_noncompliant() {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //Noncompliant : `NODE_TLS_REJECT_UNAUTHORIZED` is set to `0`.
        request.get('https://dev.app.idt.net/v1/status?user_key=' + use_key, function (err, response, body) {
            if (err) callback(err);
            var status = JSON.parse(body);
            callback(err, status);
    })
}
// {/fact}

// {fact rule=lack-of-tls-cert-verification@v1.0 defects=0}

function node_tls_reject_compliant() {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'; //Compliant : `NODE_TLS_REJECT_UNAUTHORIZED` is not set to `0`.
        request.get('https://dev.app.idt.net/v1/status?user_key=' + use_key, function (err, response, body) {
            if (err) callback(err);
            var status = JSON.parse(body);
            callback(err, status);
    })
}
// {/fact}