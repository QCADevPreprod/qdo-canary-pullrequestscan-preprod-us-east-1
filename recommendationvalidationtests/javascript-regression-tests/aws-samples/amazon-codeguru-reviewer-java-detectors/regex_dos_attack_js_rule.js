//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express')
const app = express()

// {fact rule=improper-input-validation@v1.0 defects=1}

function regex_dos_attack_noncompliant() {
    app.get("/not-ok", (req, res) => {
        var re = /([a-z]+)+$/;
        let match = re.test(req.params.id); //Noncompliant : user-controlled data passes into `test` for regex patterns.
    });
}
// {/fact}

// {fact rule=improper-input-validation@v1.0 defects=0}

function regex_dos_attack_compliant() {
    app.get("/ok", (req, res) => {
        var re = /([a-z]+)+$/;
        let match = re.test('cdbbdbsbz');//Compliant : trusted data passes into `test` for regex patterns.
    });
}
// {/fact}