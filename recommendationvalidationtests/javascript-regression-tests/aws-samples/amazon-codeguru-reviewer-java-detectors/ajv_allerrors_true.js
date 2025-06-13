/*
* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

const Ajv = require("ajv")

// {fact rule=resource-leak@v1.0 defects=1}

function ajv_allerrors_true_noncompliant() {
    // Noncompliant: `allErrors` attribute is set to `true`.
    const settings = { allErrors: true, smth: 'else' }
    const ajv1 = new Ajv(settings);
    return ajv1
}

// {/fact}

// {fact rule=resource-leak@v1.0 defects=0}

function ajv_allerrors_true_compliant() {
    // Compliant: `allErrors` attribute is set to `false`.
    const settings = { allErrors: false, smth: 'else' }
    const ajv1 = new Ajv(settings);
    return ajv1
}

// {/fact}