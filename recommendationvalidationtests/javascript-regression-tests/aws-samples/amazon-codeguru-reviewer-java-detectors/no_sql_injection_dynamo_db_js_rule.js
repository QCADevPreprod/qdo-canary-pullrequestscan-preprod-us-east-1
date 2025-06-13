//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0
const AWS = require('aws-sdk');
const express = require("express");
const app = express();
// {fact rule=no_sql_injection_dynamo_db_js_rule@v1.0 defects=1}

function non_compliant() {
    app.get('/api/getallusers', function(req,res) {
        var dobClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params= req.body.params;
        dobClient.query(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                data.Items.forEach(function(element, index, array) {
                console.log(element.Title.S + " (" + element.Subtitle.S + ")");
                });
            }
        });
    })
}
// {/fact}

// {fact rule=no_sql_injection_dynamo_db_js_rule@v1.0 defects=0}

function compliant() {
    app.get('/api/getallusers', function (req, res){
        var dobClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params= "req.body.params";
        dobClient.query(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                data.Items.forEach(function(element, index, array) {
                console.log(element.Title.S + " (" + element.Subtitle.S + ")");
                });
            }
        });
    })
}
// {/fact}