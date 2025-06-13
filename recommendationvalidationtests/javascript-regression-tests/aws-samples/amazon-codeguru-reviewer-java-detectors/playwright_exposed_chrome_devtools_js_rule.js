/**
 * License-Identifier: Apache-2.0
 */
// {fact rule=playwright_exposed_js_rule@v1.0 defects=1}

const { chromium } = require('playwright');
const express = require("express")

const app = express();

function non_conformant1(){
    app.get("/",async () => {
      const brow = await chromium.launch({args:['--remote-debugging-address=123','--somethin-else']});
      const pg = await browser.newPage();
      await pg.goto('https://example123.com');
      await brow.close();
    })
    }

// {/fact}

// {fact rule=playwright_exposed_js_rule@v1.0 defects=0}

function conformant1(){
    app.post("/", async () => {
      // ok:playwright-exposed-chrome-devtools
      const brow = await chromium.launch({args:['--somethin-else', '--more-examples']});
      const pg = await browser.newPage();
      await pg.goto('https://example123.com');
      await brow.close();
    })
    }
// {/fact}

