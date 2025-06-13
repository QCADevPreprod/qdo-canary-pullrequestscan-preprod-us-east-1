// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const express = require('express');
const helmet = require('helmet');
const app = express();

//{fact rule=http_non_refer_policy_js_rule@v1.0 defects=1}
function non_conformant(){
    app.use(
        helmet.referrerPolicy({
          policy: 'no-referrer-when-downgrade' // Non-Compliant
        })
      );
}

//{fact rule=http_non_refer_policy_js_rule@v1.0 defects=0}
function conformant(){
    app.use(
        helmet.referrerPolicy({
          policy: 'no-referrer' // Compliant
        })
      );
}