//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=stack-trace-exposure@v1.0 defects=1}

const express = require('express');
const app = express();

function noncompliant()
{
    app.get('/', (req, res) => {
        try {
            throw new Error('');
        }
        catch (e) {
            var stackTrace = e.stack;
        }
        return res.send(stackTrace); // non-conformant
    })
}
// {/fact}


// {fact rule=stack-trace-exposure@v1.0 defects=0}
function compliant()
{
    app.get('/', (req, res) => {
        try {  
            var test = 10;
            if(test === 10){
            console.log("hello");
                }
          }  
        catch (e) {  
            var stackTrace = e.stack || e.stacktrace;  
          }
        return test;  // conformant
    })
}
// {/fact}