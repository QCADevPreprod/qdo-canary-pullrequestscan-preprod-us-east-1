//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const express = require('express')
const app = express()
const path = require('path')

// {fact rule=path-traversal@v1.0 defects=1}

function express_path_traversal_noncompliant() {
    app.get('/test', (req, res) => {
        var extractPath = path.join(opts.path, req.query.path); //Noncompliant : untrusted input accesses file path.
        extractFile(extractPath);
        res.send('Hello World!');
    })
}
// {/fact}

// {fact rule=path-traversal@v1.0 defects=0}

function express_path_traversal_compliant() {
    app.post('/ok-test', function okTest(req,res) {
        let data = ['one', 'two', 'three'];
        for (let x of data) {
            var pth = path.join(opts.path, x); //Compliant : trusted input accesses file path.
            doSmth(pth);
        }
    })
}
// {/fact}