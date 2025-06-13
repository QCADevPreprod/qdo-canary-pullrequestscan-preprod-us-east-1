/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires */
/**
 * This is a file for setting up the proxy server between the local server hosting React content
 * and the backend running on AWS. This is only used for local development purposes and it is not
 * used when the code is actually deployed.
 *
 * react-scripts specifically looks for this file `src/setupProxy.js`.
 *
 * See here for more details -> https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
 */

 const proxy = require('express-http-proxy');
 const request = require('request-promise');
 const FileCookieStore = require('tough-cookie-file-store-sync'); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
 const { URL } = require('url');

 // Set this to the desired backend host. If you clone, replace this with your URL
 const hostUrl = new URL('https://console.hackathon-facility-lead-times.pharmacy.amazon.dev');

 // Allow self signed certs when making https requests
 process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

 // Read the midway session cookie from ~/.midway/cookie
 const homeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
 const jar = request.jar(new FileCookieStore(`${homeDirectory}/.midway/cookie`)); // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions

 // Request object to send a request to the backend, and save the cookies in the cookie jar
 const hostRequestObject = {
   url: hostUrl.href,
   jar: jar,
   headers: {
     'User-Agent': 'Proxy from localhost', // Added to ensure we don't get blocked by WAF
   },
   followRedirect: true,
   resolveWithFullResponse: true,
 };

 console.log('Starting local proxy server...');

 module.exports = (app) => {
   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
   app.use(
     ['/api', '/sso'], // Note: /api should be replaced with whatever your API is available at if you clone this
     proxy(hostUrl.href, {
       // Logs as requests are made
       proxyReqPathResolver: (req) => {
         console.log(`Request made to '${req.originalUrl}'`);
         return req.originalUrl;
       },

       // Intercepts requests and add the proper cookies to the headers
       proxyReqOptDecorator: async (proxyReqOpts) => {
         const response = await request(hostRequestObject); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

         const responseOrigin = new URL(response.request.uri.href).origin; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
         if (responseOrigin !== hostUrl.origin) {
           const errorMsg =
             responseOrigin === 'https://midway-auth.amazon.com'
               ? 'You were redirected to Midway indicating your Midway cookie is expired or does not exist. Run "mwinit" to set your Midway cookie'
               : `Expected request to ${hostUrl.toString()} but was redirected to ${responseOrigin}. Your src/setupProxy.js may be misconfigured.`;

           throw new Error(errorMsg);
         }

         proxyReqOpts.headers['cookie'] = jar.getCookieString(hostUrl);
         return proxyReqOpts;
       },
     })
   );
 };