//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

// {fact rule=jwt_exposed_credential_js_rule@v1.0 defects=1}
function new_noncompliant()
{
    var jose = require("jose");
    var { JWT } = jose;

    let jwtSign = JWT.sign({password : 'password'})
}
// {/fact}

// {fact rule=jwt_exposed_credential_js_rule@v1.0 defects=0}
function new_compliant()
{
    var jose = require("jose");
    var { JWT } = jose;

    let jwtSign = JWT.sign({username : 'user'})
}
// {/fact}

