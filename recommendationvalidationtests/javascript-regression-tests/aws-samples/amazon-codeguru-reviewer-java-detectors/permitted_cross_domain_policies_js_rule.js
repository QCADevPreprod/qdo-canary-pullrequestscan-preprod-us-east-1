/**
 * License-Identifier: Apache-2.0
 */
// {fact rule=permitted_cross_domain_policies_js_rule@v1.0 defects=1}
const express = require('express');
const helmet = require('helmet');

const app = express();

function non_conformant(){
    app.use(
    helmet.permittedCrossDomainPolicies({
        permittedPolicies: false, // non-conformant
    })
    );

}

// {/fact}

// {fact rule=permitted_cross_domain_policies_js_rule@v1.0 defects=0}

function conformant(){
    app.use(
        helmet.permittedCrossDomainPolicies({
          permittedPolicies: "none", // conformant
        })
      );
}
// {/fact}

