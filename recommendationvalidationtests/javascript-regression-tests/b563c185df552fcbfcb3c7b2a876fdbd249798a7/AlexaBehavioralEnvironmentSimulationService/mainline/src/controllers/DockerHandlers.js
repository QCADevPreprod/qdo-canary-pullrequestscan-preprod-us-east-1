'use strict';
const { Docker } = require('node-docker-api');
const logger = require('../config/utils').getLogger(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const {v4} = require('uuid');
const express = require('express');
const app = express();

module.exports = {
  submitJob: submitJob,
  terminateJob: terminateJob,
};

async function submitJob({companyId, jobName, dbJobId, artifactType, artifactURI, mapping, options, waitToStart}) {
  let FAKE_JOB_ID = dbJobId;
  let environmentVariables = [
    'BATCH_FILE_TYPE=' + artifactType,
    'BATCH_FILE_S3_URL=' + artifactURI,

    'ABES_JOB_ID=' + dbJobId,
    'COMPANY_ID=' + companyId,
    'MAPPING=' + mapping,
    'SCENARIO_OPTS=' + options,

    'ABES_JOB_ID=' + dbJobId,

    'FAKE_RPI=true',
    'FAKE_ARPS=true',

    'REDIS_ENDPOINT=127.0.0.1',
    'REDIS_PORT=6379',
    'MQTT_ENDPOINT=' + 'a1txuc238c4fsn-ats.iot.us-west-2.amazonaws.com',
    'DYNAMODB_ENDPOINT=' + 'http://localhost:8000',
    'DYNAMODB_REGION=us-west-2',

    'AWS_ACCESS_KEY_ID=' + process.env.AWS_ACCESS_KEY_ID,
    'AWS_SECRET_ACCESS_KEY=' + process.env.AWS_SECRET_ACCESS_KEY,
    'AWS_SESSION_TOKEN=' + process.env.AWS_SESSION_TOKEN,
    'WAIT_TO_START=' + waitToStart,
    'MAX_PAUSE_TIME=60',

    'AWS_REGION=' + config.awsRegion,
  ]
  logger.debug('Start docker with env : ' + environmentVariables)

  const docker = new Docker({socketPath: '/var/run/docker.sock'});
  let container = await docker.container.create({
    Image: `localhost/${process.env.USER}/mdxsimulatorserviceimagebuild`,
    name: FAKE_JOB_ID,
    NetworkMode: 'host',
    Env: environmentVariables,
  });
  await container.start();

  return {
    jobName: jobName,
    jobId: v4(),
  };
}

app.post('/create',  (req, res) => {
	const docker = new Docker({ socketPath: '/var/run/docker.sock' });
		docker.container.create({
			Image: req.params.img,
			name: req.params.name
		})
		.then(container => container.start())
})

async function terminateJob(jobId) {
  logger.debug('Stop docker ' + jobId);

  const docker = new Docker({socketPath: '/var/run/docker.sock'});
  let containers = await docker.container.list();
  containers.forEach(
    (container) => {
      if (container.data.Names.indexOf('/' + jobId) != -1) {
        logger.debug('Stopping container');
        container.stop();
        container.delete();
      }
    }
  );
}
