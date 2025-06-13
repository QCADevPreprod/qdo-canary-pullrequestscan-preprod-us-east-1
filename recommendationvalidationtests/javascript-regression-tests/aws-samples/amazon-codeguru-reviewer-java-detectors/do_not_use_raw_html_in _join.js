//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=cross-site-scripting@v1.0 defects=1}
function raw_html_in_join_noncompliant(data)
{
    // NonCompliant : Raw html is used in join method.
    let html = ["<span class=\"someclass\">", data, "</span>"].join();
}
// {/fact}


// {fact rule=cross-site-scripting@v1.0 defects=0}
function raw_html_in_join_compliant(data1, data2)
{
    // Compliant : Raw html is not used in join method.
    const output = [data1, data2].join();
}
// {/fact}



