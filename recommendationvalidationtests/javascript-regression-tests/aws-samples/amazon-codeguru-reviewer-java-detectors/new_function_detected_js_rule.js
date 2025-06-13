//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=new_function_detected_js_rule@v1.0 defects=1}
function new_function_detected_noncompliant()
{
    const express = require('express');
    const app = express();
    app.post('/eval',  (req, res) => {
        let notEvaluatedFunc = new Function(req.body);
    })
}
// {/fact}

// {fact rule=new_function_detected_js_rule@v1.0 defects=0}
function new_function_detected_compliant()
{
    let func = new Function('var x = "static strings are okay";');
    // Compliant: Hardcoded input provided to new Function.
    func();
}
// {/fact}

