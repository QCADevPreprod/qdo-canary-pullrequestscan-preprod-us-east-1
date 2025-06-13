/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=avoid-running-insecure-content-in-electron-js-rule@v1.0 defects=1}

const { BrowserWindow } = require("electron")

const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true, //Noncompliant: `nodeIntegration` property is enabled
        allowRunningInsecureContent: true, //Noncompliant: `allowRunningInsecureContent` property is enabled
        webSecurity: false //Noncompliant: `webSecurity` property is disabled
    }
});

// {/fact}

// {fact rule=avoid-running-insecure-content-in-electron-js-rule@v1.0 defects=0}

const win = new BrowserWindow({
    webPreferences: { 
        nodeIntegration: false, //Compliant: `nodeIntegration` property is disabled
        allowRunningInsecureContent: false, //Compliant: `allowRunningInsecureContent` property is disabled
        webSecurity: true //Compliant: `webSecurity` property is enabled
    }
});

// {/fact}