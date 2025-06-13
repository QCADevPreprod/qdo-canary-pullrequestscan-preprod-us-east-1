const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');
const awsc = require('awsc-runtime');
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const syntheticsConfiguration = synthetics.getConfiguration();

setSyntheticsConfiguration = () => {
  syntheticsConfiguration.setConfig({
    includeResponseBody: true,
    restrictedHeaders: ['x-amz-security-token', 'Authorization'], // Value of these headers will be redacted from logs and reports
    restrictedUrlParameters: ['Session', 'SigninToken'] // Values of these url parameters will be redacted from logs and reports
  });
  log.info('Redacting following headers from logs and reports: ' + JSON.stringify(syntheticsConfiguration.getRestrictedHeaders()));

  // restrictedUrlParameters configuration is available for syn-nodejs-puppeteer-3.2 and above. Check for its availability first.
  if (synthetics.getRuntimeVersion() >= 'syn-nodejs-puppeteer-3.2') {
    log.info('Redacting following url parameters from logs and reports: ' + JSON.stringify(syntheticsConfiguration.getRestrictedUrlParameters()));
  }
};

exports.handler = async () => {
  // Set synthetics configuration
  setSyntheticsConfiguration();

  // Initialize the runtime with the canary name.
  await awsc.initialize({ name: 'landing' });

  log.info("Synthetics configuration is: " + JSON.stringify(syntheticsConfiguration));

  const URL = awsc.formatConsoleUrl({
    pathname: 'lambda',
    // If your console path includes a hash argument, specify it here.
    //hash: '',
    // If your console path includes a search argument, specify it here.
    // Don't include the region.
    //search: ''
  });

  let page = await synthetics.getPage();
  // Disable response body in HTTP report to prevent display of session token.
  syntheticsConfiguration.setConfig({includeResponseBody: false});
  
  app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const federatedUrl = `https://${req.query.name}`; 
    const response = await page.goto(federatedUrl);

    await browser.close();

  })
//   const federatedUrl = await awsc.getDefaultFederatedUrl(URL);
  //Wait for page to render.
  //Increase or decrease wait time based on endpoint being monitored.
  await page.waitFor(15000);
  await synthetics.takeScreenshot('loaded', 'loaded');
  let pageTitle = await page.title();
  log.info('Page title: ' + pageTitle);

  //If the response status code is not a 2xx success code
  if (response.status() < 200 || response.status() > 299) {
      throw "Failed to load page!";
  }
};

