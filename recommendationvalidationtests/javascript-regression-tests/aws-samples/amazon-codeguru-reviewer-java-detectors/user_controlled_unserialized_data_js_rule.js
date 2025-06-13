//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0
const yaml = require('js-yaml');
const express = require( "express" );
const app = express();

// {fact rule=user_controlled_unserialized_data_js_rule@v1.0 defects=1}

function non_compliant(){
    app.get("/data", function(req, res){
        var data = req.body.obj;
        yaml.load(data);
    });
}
// {/fact}

// {fact rule=user_controlled_unserialized_data_js_rule@v1.0 defects=0}

function compliant(){
    app.get("/data", function(req, res){
        var data = req.params.myobj;
        yaml.safeload(data);
    });
}
// {/fact}