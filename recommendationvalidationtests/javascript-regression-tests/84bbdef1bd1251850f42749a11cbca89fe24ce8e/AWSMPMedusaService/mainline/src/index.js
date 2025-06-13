Error.stackTraceLimit = Infinity;

var _ = require('lodash');
const express = require('express');
const medusaScripts = require('awsmp-medusa-scripts');
const bodyParser = require('body-parser');
const app = express();
const uuidv4 = require('uuid/v4');
const stateddb = require('./stateddb');
const approvalsddb = require('./approvalsddb');
const apollo = require('./util/apollo');
const approvals = require('./approvals');
const pingMiddleware = require('./middleware/ping');
const LOG = require('./util/logger');

app.use(bodyParser.json());
app.use(LOG.service);
app.use('/s?ping', pingMiddleware);

// app.post('/projects', async (req, res) => {
//     const guid = await stateddb.registerProjectId();
//     if (guid) {
//         res.json({guid}).end();
//     } else {
//         res.status(500).send({error: 'Unable to generate Project Id'});
//     }
// });

// app.post('/projects/:projectId/tasks/:taskId', async (req, res) => {
//     const projectId = req.params.projectId;
//     const taskId = req.params.taskId.toLowerCase();
//     const hasRegisteredProjectId = await stateddb.hasRegisteredProjectId(projectId);
//     if (hasRegisteredProjectId && medusaScripts.hasOwnProperty(taskId)) {
//         try {
//             const startTime = +Date.now();
//             const guid = uuidv4();
//             const configs = {stage: apollo.stage, guid};
//             const args = Object.assign({}, req.body, configs);
//             const output = await medusaScripts[taskId](args);
//             await stateddb.putTask(projectId, guid, startTime, taskId);
//             res.json({guid, output}).end();
//         } catch (e) {
//             LOG.app.error(e);
//             res.status(500).send({error: 'An error has occurred, please try again later.'});
//         }
//     } else {
//         res.status(404).send({error: 'Task does not exist'});
//     }
// });

app.post('/approvals', async (req, res) => {
    // create an id, add row to Approvals DDB
    const requestId = await approvalsddb.registerRequest(req.body);
    const params = Object.assign({},
        req.body,
        {'attributeList': [{"name": "RequestId", "type": "SIMPLE_TEXT", "value": requestId}]});

    // create approvals request
    const result = await approvals(params);

    // return the request id
    res.json(requestId).end();
});

app.get('/approvals/:requestId', async (req, res) => {
    const requestId = req.params.requestId;
    const approvalInfo = await approvalsddb.getApproval(requestId);
    if (_.isEmpty(approvalInfo)) {
        // no info exists for request id specified in request, return 404
        res.status(404).send(`No request found with Id ${requestId}`).end();
    } else {
        res.json({"State": approvalInfo.Item.ApprovalState}).end();
    }
});

app.listen(3080, () => LOG.app.info('Opened to port 3080!'));