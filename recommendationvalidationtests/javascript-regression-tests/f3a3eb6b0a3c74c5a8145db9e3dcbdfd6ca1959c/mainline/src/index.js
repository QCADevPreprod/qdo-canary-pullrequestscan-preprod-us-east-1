const cluster = require("cluster");
const os = require("os");
process.env.UV_THREADPOOL_SIZE = 128;

if (cluster.isMaster) {
  let cpuCount = os.cpus().length;

  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  cluster.on("exit", worker => {
    console.log("Worker %d died :(", worker.id);
    cluster.fork();
  });

  // Code to run if we're in a worker process
} else {
  const { validateHeader, validateStratosInput } = require('./validation/validator');
  const { stratosHandler } = require('./handlers/stratos');

  // Setup Express Server
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  const port = 8080; // TODO: Config file

  // GET Handler, can be used for pings
  app.get("/", async (req, res) => {
    console.log("Received GET request to /");
    console.log(`Headers ${JSON.stringify(req.headers)}`);
    try {
      validateHeader(req.headers);
    } catch (e) {
      console.log(e);
      let message = `Validation Error: ${e.stack}`;
      res.status(400).send(message);
      return;
    }
    res.send("Hello from Stratos");
  });

  // POST Handler for stratos
  app.post('/', async (req, res) => {

    try {
      validateHeader(req.headers);
      validateStratosInput(req.body);
    } catch (e) {
      console.log(e);
      let message = `Validation Error: ${e.stack}`;
      res.status(400).json(message);
      return;
    }

    const { functionType, payload } = req.body;

    let message;
    let statusCode = 200;

    try {
      message = await stratosHandler(functionType, payload); 
    } catch (e) {
      console.log(e);
      message = `Internal Error: ${e.message}`;
      statusCode = 500;
    }
    console.log(`Responding with status: ${statusCode}`);
    res.status(statusCode).json(message);
  });

  // Start listening for requests
  app.listen(port, () =>
    console.log(
      `Stratos started with Worker ID : ${cluster.worker.id} with a memory setup of ${Math.round(
        process.memoryUsage().heapUsed * 100
      ) / 100} MB on ${os.hostname()}!`
    )
  );
}
