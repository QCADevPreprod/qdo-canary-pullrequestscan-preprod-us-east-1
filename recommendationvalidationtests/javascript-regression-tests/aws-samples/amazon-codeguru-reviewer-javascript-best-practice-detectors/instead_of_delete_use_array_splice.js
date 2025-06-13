/*
  * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: Apache-2.0
  */
 
 // {fact rule=instead_of_delete_use_array_splice@v1.0 defects=1}
 
 function instead_of_delete_use_array_splice_noncompliant() {
    const words = ['hello', 'world', 'welcome'];
    delete words[1]; //Noncompliant as it removes `world`, but does not reindex the array. words => ['hello', undefined, 'welcome']
    console.log(words[1]); //output is `undefined`
}
// {/fact}

// {fact rule=instead_of_delete_use_array_splice@v1.0 defects=0}

function instead_of_delete_use_array_splice_compliant() {
    const words = ['hello', 'world', 'welcome'];
    var removed = words.splice(1, 1); //Compliant as it removes `world` and reindexes the array. words => ['hello', 'welcome']
    console.log(words[1]); //output is `welcome` 
}
// {/fact}