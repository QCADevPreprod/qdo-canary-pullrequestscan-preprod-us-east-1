const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const pino = require('pino');
const redis = require('redis');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const MemoryStore = require('memorystore')(session);
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const RedisStore = require('connect-redis')(session);
const appLog = require('./lib/app-log');
const Webhooks = require('./lib/webhooks.js');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const passport = require('passport');
const authStrategies = require('./auth-strategies');
const sessionlessAuth = require('./middleware/sessionless-auth.js');
const ResponseUtils = require('./lib/response-utils.js');
const expressPinoLogger = require('express-pino-logger');

// This is a workaround till BigInt is fully supported by the standard
// See https://tc39.es/ecma262/#sec-ecmascript-language-types-bigint-type
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
// If this is not done, then a JSON.stringify(BigInt) throws
// "TypeError: Do not know how to serialize a BigInt"
/* global BigInt:writable */
/* eslint no-extend-native: ["error", { "exceptions": ["BigInt"] }] */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * Create an express app using config
 * @param {object} config
 */
async function makeApp(config, models) {
  if (typeof config.get !== 'function') {
    throw new Error('config is required to create app');
  }
  if (!models) {
    throw new Error('models is required to create app');
  }

  const webhooks = new Webhooks(config, models, appLog);

  const expressPino = expressPinoLogger({
    level: config.get('webLogLevel'),
    timestamp: pino.stdTimeFunctions.isoTime,
    name: 'sqlpad-web',
    // express-pino-logger logs all the headers by default
    // Removing these for now but open to adding them back in based on feedback
    redact: {
      paths: [
        'req.headers',
        'res.headers',
        'req.remoteAddress',
        'req.remotePort',
      ],
      remove: true,
    },
  });

  /*  Express setup
  ============================================================================= */
  const app = express();

  // Default helmet protections, minus frameguard (becaue of sqlpad iframe embed), adding referrerPolicy
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts({}));
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

  // Decorate req and res with SQLPad objects and utils
  app.use(function (req, res, next) {
    req.config = config;
    req.models = models;
    req.appLog = appLog;
    req.webhooks = webhooks;

    res.utils = new ResponseUtils(res, next);

    next();
  });

  app.use(expressPino);

}