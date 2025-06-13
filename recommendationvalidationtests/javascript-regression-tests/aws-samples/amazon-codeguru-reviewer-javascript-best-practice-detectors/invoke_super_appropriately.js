/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=invoke_super_appropriately@v1.0 defects=1}

//function invoke_super_appropriately_non_compliant() {
class Dog extends Animal {
    constructor(name) {
        super();
        this.name = name;
        super();
        super.doSomething();
        super();
    }
}
//}
// {/fact}

// {fact rule=invoke_super_appropriately@v1.0 defects=0}

//function invoke_super_appropriately_compliant() {
class Square extends Rectangle {
    constructor(length) {
        super(length, length);
        this.name = 'Square';
    }
}
//}
// {/fact}