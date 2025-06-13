/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// {fact rule=express_puppeteer_injection_js_rule@v1.0 defects=1}
const express = require('express');
const app = express();
const port = 3000
const puppeteer = require('puppeteer');

function non_conformant(){
  
    app.post('/test', async (req, res) => {
      const browser_launch = await puppeteer.launch({headless: true});
      const new_page = await browser_launch.newPage();
      await new_page.setContent(`${req.body.foo}`); // non-conformant
  
      await new_page.screenshot({path: 'test.png'});
      await browser_launch.close();
  
    })
  
  }

// {/fact}

// {fact rule=express_puppeteer_injection_js_rule@v1.0 defects=0}
function conformant(){

    app.post('/ok-test', async (req, res) => {
      const browser_launch = await puppeteer.launch();
      const page = await browser_launch.newPage();
      await page.goto('https://code.com'); // conformant
  
      await page.screenshot({path: 'code.png'});
      await browser_launch.close();
  
    })
  
  }

// {/fact}