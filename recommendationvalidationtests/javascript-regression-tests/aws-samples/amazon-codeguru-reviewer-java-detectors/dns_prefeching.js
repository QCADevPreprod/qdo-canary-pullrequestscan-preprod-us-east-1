/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=dns_prefetching_js_rule@v1.0 defects=1}

function dns_prefetching_noncompliant()
{
    const express = require('express');
    const helmet = require('helmet');
    let app = express();

    app.use(
        helmet.dnsPrefetchControl({
            allow: true // non_conformant
        })
    );
}
// {/fact}

// {fact rule=dns_prefetching_js_rule@v1.0 defects=0}

function dns_prefetching_compliant()
{
    const express = require('express');
    const helmet = require('helmet');
    let app = express();

    app.use(
        helmet.dnsPrefetchControl({
            allow: false // non_conformant
        })
    );
}
// {/fact}