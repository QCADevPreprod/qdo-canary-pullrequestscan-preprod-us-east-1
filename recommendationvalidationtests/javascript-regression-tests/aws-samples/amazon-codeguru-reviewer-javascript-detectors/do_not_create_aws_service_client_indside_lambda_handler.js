//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const AWS = require("aws-sdk");

// {fact rule=do_not_create_aws_service_client_inside_lambda_handler_js_rule@v1.0 defects=1}
exports.do_not_create_aws_service_client_inside_lambda_handler_js_rule_noncompliant = function (event, context, callback) {
    // Noncompliant: SageMaker's client is created inside of lambda handler function.
    var sagemaker = new AWS.SageMaker();
    sagemaker.addAssociation(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}

// {/fact}

// {fact rule=do_not_create_aws_service_client_inside_lambda_handler_js_rule@v1.0 defects=0}

// Compliant: SageMaker's client is created outside of lambda handler function and can be reused.
var sagemaker = new AWS.SageMaker();
exports.do_not_create_aws_service_client_inside_lambda_handler_js_rule_compliant = function (event, context, callback) {
    sagemaker.addAssociation(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}

// {/fact}