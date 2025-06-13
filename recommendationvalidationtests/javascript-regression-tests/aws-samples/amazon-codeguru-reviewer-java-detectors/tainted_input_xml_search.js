//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const https = require("https");

// {fact rule=tainted_input_xml_js_rule@v1.0 defects=1}
function nonCompliant() {
    app.get('/some/route', function(req, res) {
        let userName = req.params.userName;
        var xml = "<book><title>Harry Potter</title></book>"
        var doc = new dom().parseFromString(xml)
        var nodes = xpath.select("//title" + userName, doc)
      });
    
}
// {/fact}

// {fact rule=tainted_input_xml_js_rule@v1.0 defects=0}
function compliant() {
    app.get('/some/route', function(req, res) {
        let userName = req.params.userName;
        var xml = "<book><title>Harry Potter</title></book>"
        var doc = new dom().parseFromString(xml)
        var nodes = xpath.select("//title" + escape(userName), doc)
      });
    
}
// {/fact}