'use strict';

// Usage:
// node src/fremontdatafanlambda/tools/refreshES.js clean all # drop all indices
// node src/fremontdatafanlambda/tools/refreshES.js clean OrderDDBTable # drop the  order index
// node src/fremontdatafanlambda/tools/refreshES.js all OrderDDBTable # create order index
// node src/fremontdatafanlambda/tools/refreshES.js all all # create all indices
// NOTE: recommend piping the stderr to a different file than the stdout - while also showing on screen
// (node src/fremontdatafanlambda/tools/refreshES.js all OrderDDBTable | tee stdout.log) 3>&1 1>&2 2>&3 | tee stderr.log

const AWS = require("aws-sdk");
const toES = require('../elasticsearch/toES');
const developES = require('./developES');
const toESNetwork = require('../elasticsearch/toESNetwork');
const base = require('../base');
const pLimit = require('p-limit');
const http = require('http');
const agent = new http.Agent({
    keepAlive: true
});

const sendDynamoRecordToES = async (tableName, record, id, elasticClient, dynamodb) => {
    if (record) {
        console.log("Item : " + tableName + " " + JSON.stringify(id));
        await toES.transformFremontRecordAndIndexIt(elasticClient, id, tableName, record, true, dynamodb);
    }
};

// The "tuningTable" specifies the number of concurrent p-limit pools for each table type
// Some of the bigger tables can have more concurrent pools as the bottleneck is the NUMBER of ES requests per second
// so the smaller tables such as port, lag, node finish their request really quickly and can only have 5-6 concurrent pools
// This number will vary based on environment Mac vs Cloud desktop vs internet speeds
const asyncPoolTuningTable = {
    "OrderDDBTable": 10,
    "CircuitDesignDDBTable": 100,
    "LagDDBTable": 5,
    "PortDDBTable": 5,
    "NodeDDBTable": 5,
    "AsnDDBTable": 5,
    "UnitDDBTable": 5,
    "ProviderDDBTable": 5,
    "SiteDDBTable": 5,
    "ProviderCircuitDDBTable": 10,
    "DemarcAndCfaDDBTable": 5,
    "WorkOrderDDBTable": 5
}

const scanDynamo = async (elasticClient, tableName, dynamodb) => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let params = {
        TableName: tableName
    };

    // CALLS THE DYNAMO DB TABLE DIRECTLY and SCANS IT, onScan callback function is run synchronously and processes
    // the results from the scan.
    // synchronously meaning that the for loop calling scanDynamo runs each table in parallel by opening up
    // a new esClient for each table
    await docClient.scan(params, onScan);

    async function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            // THe p-limit library can be used to specify the number of concurrent promises
            // It means that no more than 100 running at one time...if 100 active promises, then once 1 resolves a new can be added
            // ES does not like too many requests at the same time....so this number may have to be moved up and down based on local env.
            const limit = pLimit(asyncPoolTuningTable[tableName]);

            const all = async () => {
                const key = base.constants.TABLES_FOR_ES_PRIMARY_KEYS[tableName] || base.constants.CHILD_TABLES_FOR_ES_CIRCUIT_DESIGN_DDB[tableName];
                const promises = data.Items.map(itemData => limit(() =>
                    sendDynamoRecordToES(tableName, itemData, itemData[key], elasticClient, dynamodb)));
                await Promise.all(promises);
                console.log('.all done');
            };

            await all();

            // continue scanning if we have more items
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                await docClient.scan(params, onScan);
            }
        }
    }
}

const filterTables = (tableNameCamelCase) =>
    (tableNameCamelCase === "all" || tableNameCamelCase === undefined)
    ? Object.keys(base.constants.TABLES_FOR_ES_PRIMARY_KEYS)
    : Object.keys(base.constants.TABLES_FOR_ES_PRIMARY_KEYS)
        .filter(key => key === tableNameCamelCase);

const invoke = async (myArgs) => {
    const action = myArgs.shift();
    const tableNameCamelCase = myArgs.shift(); // OrderDDBTable
    console.log("invoke says", action, tableNameCamelCase);

    if (action === "clean") {
        const elasticClient = await toESNetwork.getESClient();
        for (const tableName of filterTables(tableNameCamelCase)) {
            await toESNetwork.deleteESIndex(elasticClient, tableName);
            await toESNetwork.instantiateESIndexSettings(elasticClient, tableName);
        }
    }
    if (action === "all") {
        const ddb = new AWS.DynamoDB({
            httpOptions: {
                agent
            }
        });
        for (const tableName of filterTables(tableNameCamelCase)) {
            // CALLS THE DYNAMO DB TABLE DIRECTLY and SCANS IT, onScan callback function is run synchronously and processes
            // the results from the scan.
            // synchronously meaning that the for loop calling scanDynamo runs each table in parallel by opening up
            // a new esClient for each table
            const elasticClient = await toESNetwork.getESClient();
            await scanDynamo(elasticClient, tableName, ddb);
        }
        agent.destroy();
    }
    if (action === "child") {
        const ddb = new AWS.DynamoDB({
            httpOptions: {
                agent
            }
        });
        for (const tableName of Object.keys(base.constants.CHILD_TABLES_FOR_ES_CIRCUIT_DESIGN_DDB)) {
            // CALLS THE DYNAMO DB TABLE DIRECTLY and SCANS IT, onScan callback function is run synchronously and processes
            // the results from the scan.
            // synchronously meaning that the for loop calling scanDynamo runs each table in parallel by opening up
            // a new esClient for each table
            const elasticClient = await toESNetwork.getESClient();
            await scanDynamo(elasticClient, tableName, ddb);
        }
        agent.destroy();
    }
    if (action === "test") {
        const elasticClient = await toESNetwork.getESClient();
        await developES.testSearch(elasticClient);
        await developES.testSettings(elasticClient);
    }

    if (action === "validate") {
        const ddb = new AWS.DynamoDB({
            httpOptions: {
                agent
            }
        });
        const elasticClient = await toESNetwork.getESClient();
        await validateES.scanDynamo(elasticClient, base.constants.FREMONT_TABLES.circuit, ddb);
        agent.destroy();
    }
};

(async () => {
    let myArgs = process.argv.slice(2);
    // just get the first arg "clean" or "all"
    await invoke(myArgs);
})();
