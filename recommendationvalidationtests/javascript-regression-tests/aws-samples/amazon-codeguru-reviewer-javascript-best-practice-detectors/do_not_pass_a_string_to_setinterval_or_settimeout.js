/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=do_not_pass_string_to_setinterval_or_settimeout@v1.0 defects=1}

function do_not_pass_string_to_setinterval_or_settimeout_non_compliant() {
    var timeoutID = setTimeout("setTimeout Demo!", 3000); // Noncompliant: String is passed to setTimeout method
    console.log('Id: ' + timeoutID)
}

// {/fact}

// {fact rule=do_not_pass_string_to_setinterval_or_settimeout@v1.0 defects=0}

function do_not_pass_string_to_setinterval_or_settimeout_compliant() {
    let timeObj = setTimeout(function(){   // Compliant: Function is passed to setTimeout method.
        // display the current time
        let dateTime= new Date();
        let time = dateTime.toLocaleTimeString();
        console.log(time);
    }, 2000);
}

// {/fact}