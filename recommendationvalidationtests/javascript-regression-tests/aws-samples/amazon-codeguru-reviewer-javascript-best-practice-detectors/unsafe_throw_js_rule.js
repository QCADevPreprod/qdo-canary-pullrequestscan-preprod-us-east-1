/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=unsafe_throw_js_rule@v1.0 defects=1}

function unsafe_throw_noncompliant(students) {
    students.forEach((student) => {
	    if (student.age < 15) {
	        throw "disqualified"; // Noncompliant : `throw` a string
	    }
	})
}
// {/fact}

// {fact rule=unsafe_throw_js_rule@v1.0 defects=0}

function unsafe_throw_compliant(students) {
    students.forEach((student) => {
	    if (student.age < 15) {
	        throw new Error(); // Compliant : `throw` `Error` object
	    }
	})
}
// {/fact}