// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// {fact rule=integrity_check_external_script_js_rule@v1.0 defects=1}
function integrity_check_external_script_non_compliant(){
    let script = document.createElement("script"); // Sensitive
	script.src = "https://cdnexample.com/script-latest.js";
    //Non-confromant : Integrity is not checked.
	script.crossOrigin = "anonymous";
	document.head.appendChild(script);
}
// {/fact}

// {fact rule=integrity_check_external_script_js_rule@v1.0 defects=0}
function integrity_check_external_script_compliant(){
    let script = document.createElement("script");
	script.src = "https://cdnexample.com/script-v1.2.3.js";
	script.integrity = "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"; // Compliant
	script.crossOrigin = "anonymous";
	document.head.appendChild(script);
}