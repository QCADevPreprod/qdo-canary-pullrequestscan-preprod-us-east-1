/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=no_empty_functions_rule@v1.0 defects=1}

function no_empty_functions_non_compliant() {  // Noncompliant : function definition is empty 
  
}


// {/fact}

// {fact rule=no_empty_functions_rule@v1.0 defects=0}
function no_empty_functions_compliant() {
    do_stuff();    // Compliant : function definition is not empty 
}
