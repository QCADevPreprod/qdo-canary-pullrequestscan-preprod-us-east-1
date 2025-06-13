/**
 * Provides the HTTP header configuration for the responses
 * More info - https://aristotle.corp.amazon.com/recommendations/26/
 */

 const express = require('express');
 const helmet = require('helmet');

 export function setHeaders(app) {
   // Sets "Strict-Transport-Security: max-age=5184000; includeSubDomains".
   const sixtyDaysInSeconds = 5184000;
   app.use(helmet.hsts({
     maxAge: sixtyDaysInSeconds,
   }));
 
   // Sets "X-XSS-Protection: 1; mode=block".
   app.use(helmet.xssFilter());
 
   // Sets "X-Content-Type-Options: nosniff".
   app.use(helmet.noSniff());
 
   // Don't allow me to be in ANY frames.
   // Sets "X-Frame-Options: DENY".
   app.use(helmet.frameguard({ action: 'deny' }));
 
   // Sets custom Content-Security-policy header
 
   app.use(helmet.contentSecurityPolicy({
     directives: {
       defaultSrc: ["'self'"],
       scriptSrc: ["'self'"],
       styleSrc: ["'self'", "'unsafe-inline'"],
       objectSrc: ["'none'"],
     },
   }));
 }
 