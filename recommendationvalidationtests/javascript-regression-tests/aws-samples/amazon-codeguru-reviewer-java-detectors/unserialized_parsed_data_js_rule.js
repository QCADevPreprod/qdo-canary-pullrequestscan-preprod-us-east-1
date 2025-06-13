//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0
const axios = require('axios');

// {fact rule=unserialized_parsed_data_js_rule@v1.0 defects=1}

async function non_compliant() {
    axios.get("/somelink")
    .then( response => {
        JSON.parse(response.request.response);
    });
}
// {/fact}

// {fact rule=unserialized_parsed_data_js_rule@v1.0 defects=0}

async function compliant() {
    axios.get("/somelink")
    .then( response => {
        JSON.parse('{"data":"data"}');
    });
}
// {/fact}