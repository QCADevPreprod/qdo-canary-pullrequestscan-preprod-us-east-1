/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=use_valid_values_in_typeof@v1.0 defects=1}

function use_valid_values_in_typeof_noncompliant() {
  var bool = true;
  if (typeof bool == "Boolean") {
    // NonCompliant: As "Boolean" is an invalid type.
    bool = false;
  }
}

// {/fact}

// {fact rule=use_valid_values_in_typeof@v1.0 defects=0}

function use_valid_values_in_typeof_compliant() {
  var bool1 = true;
  if (typeof bool1 === "boolean") {
    // Compliant: As "boolean" is a valid type.
    bool1 = false;
  }
}

// {/fact}
