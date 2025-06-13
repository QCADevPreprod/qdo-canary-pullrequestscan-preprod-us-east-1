/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=avoid_nan_in_comparison@v1.0 defects=1}

function avoid_nan_in_comparison_non_compliant() {
    const cars = ["Saab", "Volvo", "BMW", NaN];

    for (let i = 0; i < cars.length; i++) {
        if (cars[i] === NaN) {  // Noncompliant : always false
            console.log("Noncompliant : NaN found");
        }
    }
}
// {/fact}

// {fact rule=avoid_nan_in_comparison@v1.0 defects=0}

function avoid_nan_in_comparison_compliant() {
    const carsNC = ["Saab", "Volvo", "BMW", NaN];
    for (let i = 0; i < carsNC.length; i++) {
        console.log(carsNC[i])
        if (Number.isNaN(carsNC[i])) {  // Compliant : `Number.isNaN(<variable>)` will check if <variable> is NaN.
            console.log("Compliant : NaN found");
        }
    }
}
// {/fact}