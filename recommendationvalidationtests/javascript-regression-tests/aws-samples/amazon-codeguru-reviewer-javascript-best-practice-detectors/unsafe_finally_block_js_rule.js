/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=unsafe_finally_block_js_rule@v1.0 defects=1}

function unsafe_finally_block_noncompliant() {
    while (true) {
        try {
            return 2;
        } catch(err) {
            return 3;
        } finally {
            return 4; // Noncompliant : `return` statement in `finally` block.
        }
    }
}
// {/fact}

// {fact rule=unsafe_finally_block_js_rule@v1.0 defects=0}

function unsafe_finally_block_compliant() {
    try {
        return 1;
    } catch(err) {
        return 2;
    }finally {
        console.log("hola!"); //Compliant : No `return`, `continue`, `break` and `throw` statement in `finally` block.
    }
}
// {/fact}