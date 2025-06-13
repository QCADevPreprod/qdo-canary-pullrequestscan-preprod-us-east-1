/**
 * License-Identifier: Apache-2.0
 */
// {fact rule=do_not_expose_puppeteer_js_rule@v1.0 defects=1}

const  puppeteer  = require('puppeteer');
const express = require('express');
const app = express();

app.get("/",async () => {
    const brow = await puppeteer.launch({args:['--remote-debugging-address=123','--somethin-else']});
    const pg = await browser.newPage();
    await pg.goto('https://example123.com');
    await brow.close();
  })

// {/fact}

// {fact rule=do_not_expose_puppeteer_js_rule@v1.0 defects=0}

    app.post("/", async () => {

      const brow = await puppeteer.launch({args:['--somethin-else', '--more-examples']});
      const pg = await browser.newPage();
      await pg.goto('https://example123.com');
      await brow.close();
    })
// {/fact}

