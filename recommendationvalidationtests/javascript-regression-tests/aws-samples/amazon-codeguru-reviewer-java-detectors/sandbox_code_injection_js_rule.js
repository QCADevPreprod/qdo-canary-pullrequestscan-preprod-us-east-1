//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=code-injection@v1.0 defects=1}
function sandbox_code_injection_noncompliant()
{
    let express = require('express');
    const Sandbox = require('sandbox');
    let app = express();
    app.get('/user/:temp', function(request, response){
        const s = new Sandbox();
        // NonCompliant : Untrusted user input is used in sandbox.
        s.run('input('+response.params.temp+')', cb);
    });
}
// {/fact}


// {fact rule=code-injection@v1.0 defects=0}
function sandbox_code_injection_compliant()
{
    let express = require('express');
    const Sandbox = require('sandbox');
    let app = express();
    app.get('/user/:temp',(req,res) =>
    {
        const s = new Sandbox();
        // Compliant : Untrusted user input is used in sandbox.
        s.run('input("anyinput")', cb);
    });
}
// {/fact}