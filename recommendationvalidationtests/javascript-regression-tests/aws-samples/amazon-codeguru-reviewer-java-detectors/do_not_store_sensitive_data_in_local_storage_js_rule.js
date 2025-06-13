/*
* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

// {fact rule=do-not-store-sensitive-data-in-local-storage-js-rule@v1.0 defects=1}

async function noncompliant() {
    const {token} = await retrieveToken()
    // Noncompliant: Sensitive data being stored in `localStorage`.
    localStorage.setItem("jwtToken", token)
}

// {/fact}

// {fact rule=do-not-store-sensitive-data-in-local-storage-js-rule@v1.0 defects=0}

async function compliant() {
    const {itemName} = await retrieveItemName()
    // Compliant: Non sensitive data stored in `localStorage`.
    localStorage.setItem("Item-Name", itemName)
}

// {/fact}
