//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=cross-site-request-forgery@v1.0 defects=1}
function csrf_before_method_override_noncompliant()
{
    const express = require('express');
    // NonCompliant : method overrride is not used before csrf.
    express.csrf();
    express.methodOverride();
}
// {/fact}


// {fact rule=cross-site-request-forgery@v1.0 defects=0}
function csrf_before_method_override_compliant()
{
    const express = require('express');
    // Compliant - method overrride is used before csrf.
    express.methodOverride();
    express.csrf();
}
// {/fact}