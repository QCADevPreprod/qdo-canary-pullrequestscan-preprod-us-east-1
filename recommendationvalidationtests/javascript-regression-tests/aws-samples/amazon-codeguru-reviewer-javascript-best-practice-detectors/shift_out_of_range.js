/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=shift_out_of_range@v1.0 defects=1}

function shift_out_of_range_noncompliant() {
    const a = 5;
    const b = 45;
    console.log(a << b); // Noncompliant : The left operand a is only shifted by 13 (that is, 45 modulo 32).
}
// {/fact}

// {fact rule=shift_out_of_range@v1.0 defects=0}

function shift_out_of_range_compliant() {
    const a = 5;
    const b = 45;
    console.log(a * Math.pow(2, b));// Compliant : Using Math.power, which is complaint.
}
// {/fact}