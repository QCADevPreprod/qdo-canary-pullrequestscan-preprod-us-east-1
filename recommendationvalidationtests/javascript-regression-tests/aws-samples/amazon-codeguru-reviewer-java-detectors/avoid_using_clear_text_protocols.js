/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// {fact rule=clear_text_protocol_js@v1.0 defects=1}

function clear_text_protocol_non_compliant()
{
    let url_http_10_LocalVar = "ftp://10.1.1.123";
    //Noncompliant: http protocol is being used.
    urllib.request(url_http_10_LocalVar, function (err, data, res) { // url as string ref
        if (err) {
            throw err; // you need to handle error
        }
    });
}
// {/fact}

// {fact rule=clear_text_protocol_js@v1.0 defects=0}
function clear_text_protocol_compliant()
{
    //Compliant: https protocol is being used.
    urllib.request('https://cnodejs.org/', function (err, data, res) {
            if (err) {
                throw err; // you need to handle error
            }
        });
}
// {/fact}

