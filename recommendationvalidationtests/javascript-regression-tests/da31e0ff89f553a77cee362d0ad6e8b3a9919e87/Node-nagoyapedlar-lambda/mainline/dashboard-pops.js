const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const nJwt = require('njwt');
const config = require('./config.js');
const status = require('./http-constants');

const secureRandom = require('secure-random');
const b64string = config.web.base64SigningKey;
const signingKey = Buffer.from(b64string, 'base64') || secureRandom(256, {type: 'Buffer'});   // Create a highly random byte array of 256 bytes

const cookieToken = config.web.tokenName;

let SUB = null;

const api = config.api('dashboard-pops');
const API_TABLE = api.table;
const API_INDEX = api.index;
const ROOT_PATH = api.root;
const API_PATH = api.path;
const API_SCOPE = api.scope;
const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];


const dynamoDb = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true,
});

app.use(function(req, res, next) {
    var allowedOrigins = api.allowedOrigins;
      var origin = req.headers.origin;
      if(allowedOrigins.indexOf(origin) > -1){
          res.header('Access-Control-Allow-Origin', origin);
      }
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Credentials", true)
      next();
  });

app.use(bodyParser.json({ strict: false }));

app.use(cookieParser());

app.use((req, res, next) => {
    var d = new Date();
    console.log(`${d.toISOString()}\t${req.method}\t${req.url}\t${JSON.stringify(req.headers)}\t${JSON.stringify(req.body)}`);

    if (!req.cookies[cookieToken]) {
        res.status(status.unauthorized).json(status.Unauthorized);
    } else {
        try {
            let token = req.cookies[cookieToken];

            let verifiedJwt = nJwt.verify(token,signingKey);

            let attribute = verifiedJwt.body.scope[API_SCOPE];
            let hasPermission=false;
            switch(req.method){
                case "GET":
                if (attribute.includes("r")) {
                    hasPermission=true;
                }
                break;
                default:
                if (attribute.includes("w")) {
                    hasPermission=true;
                }
            }

            SUB = verifiedJwt.body.sub;
            console.log(`sub: ${SUB}\turl: ${req.url}\tattribute: ${attribute}\thasPermission: ${hasPermission}`);

            if (hasPermission) {
                next();
            } else {
                res.status(status.forbidden).json(status.Forbidden);
            }
        } catch(error) {
            // res.status(401).json({ error: 'Unauthorized', details: error.message });
            console.log(error);
            res.status(status.unauthorized).json(status.Unauthorized);
        }
    }
});

// Get all active entries endpoint
app.get(API_PATH, function (req, res) {
    const d = new Date();
    const params = {
        TableName: API_TABLE,
        FilterExpression: 'validTo > :timestamp and validFrom < :timestamp',
        ExpressionAttributeValues: {":timestamp":d.toISOString()},
        Limit: 1000
    }

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.log(error)
            res.status(status.bad_gateway).json({ error: 'Could not get all entries' })
        } else if (result) {
            res.json(result)
        }
    })
})

// Get all entries for a given projection
app.get(API_PATH+':projectionId', function (req,res) {
  const projectionId = req.params.projectionId;
  const d = new Date();

  const params = {
    TableName: API_TABLE,
    FilterExpression: 'projectionId = :projectionId and validTo > :timestamp and validFrom < :timestamp',
    ExpressionAttributeValues: {
      ':projectionId': projectionId,
      ':timestamp':d.toISOString()
    }
  };

  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(status.bad_gateway).json({ error: 'Could not get entries' });
    } else if (result) {
      res.json(result);
    }
  });
})

// Get the entry for a specific projection and month
app.get(API_PATH+':projectionId/:month', function (req,res) {
  const projectionId = req.params.projectionId;
  const month = req.params.month;
  const d = new Date();
  let timestamp = d.toISOString();

  const params = {
    TableName: API_TABLE,
    Key: {
      projectionId: projectionId,
      month: month
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(status.bad_gateway).json({ error: 'Could not get entry' });
    } else if (result) {
      if (result.Item.validTo > timestamp) {
        res.json(result);
      } else {
        res.status(status.not_found).json({ error: "Valid entry not found" });
      }
    }
  });
})

// Create entry endpoint
app.post(API_PATH, function (req, res) {

    if(!req.body || req.body.length === 0)
    {
        res.status(status.bad_request).json({ error: 'Request body not found' })
    }
    else if(req.body.length > 4e5)
    {
        res.status(status.request_entity_too_large).json(status.RequestEntityTooLarge);
    }
  const { projectionId, month, active, incoming, demand, validFrom, validTo } = req.body;
  let entered = new Date().toISOString()
    ,enteredBy = SUB;

  let result = validate(projectionId, month, active, incoming, demand, validFrom, validTo, entered, enteredBy);
  console.log(result);

  if (result.valid) {
    const params = {
        TableName: API_TABLE,
        Item: {
          projectionId: projectionId,
          month: month,
          active: active,
          incoming: incoming,
          demand: demand,
          validFrom: validFrom,
          validTo: validTo,
          entered: entered,
          enteredBy: enteredBy,
        },
      };

      dynamoDb.put(params, (error) => {
        if (error) {
          console.log(error);
          res.status(status.bad_gateway).json({ error: 'Could not create entry' });
        }
        var uri = ROOT_PATH + API_PATH + projectionId + '/' + month;
        res.status(status.created).json({projectionId, month, active, incoming, demand, validFrom, validTo, entered, enteredBy});
      });
  } else {
      res.status(status.bad_request).json(result);
  }
})

// Update entry endpoint
app.put(API_PATH+':projectionId/:month', function (req, res) {

    if(!req.body || req.body.length === 0)
    {
        res.status(status.bad_request).json({ error: 'Request body not found' })
    }
    else if(req.body.length > 4e5)
    {
        res.status(status.request_entity_too_large).json(status.RequestEntityTooLarge);
    }
    const { projectionId, month, active, incoming, demand, validFrom, validTo } = req.body;
    let entered = new Date().toISOString()
        ,enteredBy = SUB;

    validate(req.params.projectionId, month, active, incoming, demand, validFrom, validTo, entered, enteredBy);
    console.log(result)

    if (result.valid) {
      const params = {
        TableName: API_TABLE,
        Key: {
          projectionId: req.params.projectionId,
          month: req.params.month
        },
        UpdateExpression: 'set projectionId = :projectionId, month = :month, active = :active, incoming = :incoming, demand = :demand, validFrom = :validFrom, validTo = :validTo, entered = :entered, enteredBy = :enteredBy',
        ExpressionAttributeValues: {
          ':projectionId': projectionId,
          ':month': month,
          ':active': active,
          ':incoming': incoming,
          ':demand': demand,
          ':validFrom': validFrom,
          ':validTo': validTo,
          ':entered': entered,
          ':enteredBy': enteredBy,
        },
      };

      dynamoDb.update(params, (error, data) => {
        if (error) {
          console.log(error);
          res.status(status.bad_gateway).json({ error: 'Could not update entry' });
        } else {
          res.status(status.accepted).json(JSON.stringify(data, null, 2));
        }
      });
    } else {
      res.status(status.bad_request).json(result);
    }

  })

// Delete entry endpoint
app.delete(API_PATH+':projectionId/:month', function (req, res) {

    var d = new Date();
    d.setDate(d.getDate() - 1);
    const params = {
      TableName: API_TABLE,
      Key: {
        projectionId: req.params.projectionId,
        month: req.params.month
      },
      UpdateExpression: 'set validTo = :validTo',
      ExpressionAttributeValues: {
        ':validTo': d.toISOString(),
        },
    };

    dynamoDb.update(params, (error, data) => {
      if (error) {
        console.log(error);
        res.status(status.bad_gateway).json({ error: 'Could not delete entry' });
      } else {
        res.status(status.no_content).send();
      }
    });
  })

function isProjectionPeriod(key) {
    if (key.length !== 5) {
        return false;
    }
    const monthName = key.substring(0, 3);
    const yearSuffix = key.substring(3,5);

    return monthNames.includes(monthName) && /^\d+$/.test(yearSuffix);
}

//Validate request
function validate(projectionId, month, active, incoming, demand, validFrom, validTo, entered, enteredBy) {
    let result = { valid: true, errors: [] };
    if (typeof projectionId !== 'string') {
        result.errors.push({ error: '"projectionId" must be a string' });
    }
    if (typeof month !== 'string' && isProjectionPeriod(month)) {
        result.errors.push({ error: '"month" must be correctly formatted' });
    }
    if (typeof active !== 'object') {
        result.errors.push({ error: '"active" must be a object' });
    }
    if (typeof incoming !== 'object') {
        result.errors.push({ error: '"incoming" must be a object' });
    }
    if (typeof demand !== 'object') {
      result.errors.push({ error: '"demand" must be a object' });
    }
    if (isNaN(Date.parse(validFrom))) {
        result.errors.push({ error: '"validFrom" must be a date' });
    }
    if (isNaN(Date.parse(validTo))) {
        result.errors.push({ error: '"validTo" must be a date' });
    }
    if (isNaN(Date.parse(entered))) {
        result.errors.push({ error: '"entered" must be a date' });
    }
    if (typeof enteredBy !== 'string') {
        result.errors.push({ error: '"enteredBy" must be a string' });
    }
    if (result.errors.length > 0) {
        result.valid = false;
    }
      return result;
}

module.exports.handler = serverless(app);