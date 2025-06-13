const fs = require("fs");
const format = require("util").format;
const moment = require("moment");
const zlib = require("zlib");
const mysql = require("mysql");
const AWS = require("aws-sdk");
const json2csv = require("json2csv").parse;
const odinHelper = require("../util/odinHelper.js");
const config = require("../util/config.json");
// RDS CA certificate bundle
const rdsCACertBundle = fs.readFileSync(__dirname + "/../node-ca-certs/rds-combined-ca-bundle.pem");

const processRow = (log, csvWriteStream, columns, row, extra_columns, regionalized_columns) => {
    // Add extra columns, but do not override existing data
    Object.keys(extra_columns).forEach(function(column) {
        if (!row.hasOwnProperty(column)) {
            row[column] = extra_columns[column];
        }
    });

    Object.keys(row).forEach(function(column) {
        const jsDataType = Object.prototype.toString.call(row[column]).slice( 8, -1);

        if (jsDataType === "Date") { // Convert to Redshift format
            const originalDateFormat = row[column];
            row[column] = moment(originalDateFormat).format("YYYY-MM-DD HH:mm:ss");
        }
    });
    regionalized_columns.forEach(function(column) {
        const original_value = row[column];
        row[column] = extra_columns['region'] + ":" + original_value;
    });

    const csvOptions = {
        fields: columns,
        header: false
    };

    try {
        const csvRow = json2csv(row, csvOptions) + "\n";
        csvWriteStream.write(csvRow);
    } catch (error) {
        throw error;
    }
};

const throwError = (error) => {
    throw error;
};

const throwSqlError = (error) => {
    console.error("Error code: " + error.code);
    console.error("Failed SQL: " + error.sql);
    throw error;
};


/**
 * @param {string} region
 * @param {object} credentials
 * @param {string} table
 * @param {array} columns
 */
const exportDataToS3 = (region, credentials, map) => {
    const table = map.table;
    const columns = map.columns;
    const regionalized_columns = map.regionalize;

    let tmpFilePathPrefix;

    if (__dirname.startsWith("/local/home/")) {
        // Running in Brazil workspace
        tmpFilePathPrefix = config.devTmpFilePathPrefix;
    } else {
        // Running in Apollo environment
        tmpFilePathPrefix = config.tmpFilePathPrefix;
    }

    const csvFilePath = tmpFilePathPrefix + table + "." + region + ".csv";

    if (!fs.existsSync(tmpFilePathPrefix)){
        fs.mkdirSync(tmpFilePathPrefix);
    }

    const csvWriteStream = fs.createWriteStream(csvFilePath);
    csvWriteStream.on("error", throwError);
    const extra_columns = { 'region': config.regional[region].region_code };
    const all_columns = columns.concat(Object.keys(extra_columns));

    const log = (...args) => {
        const timestamp = new Date().toISOString();
        const prefix = format("[%s] [%s] [%s]", timestamp, region, table);
        const argsWithPrefix = Array.prototype.slice.call(args);
        argsWithPrefix.unshift(prefix);
        console.log(...argsWithPrefix);
    };

    const connection = mysql.createConnection({
        host: config.regional[region].dbHost,
        port: config.db.port,
        user: credentials.db.username,
        password: credentials.db.password,
        database: config.db.database,
        connectTimeout: 3600000, // 1 hour
        ssl: {
            rejectUnauthorized: false,
        }
    });
    connection.connect();

    let rowsCount = 0;
    let sql;

    if (map.custom_sql == "") {
        sql = "SELECT " + columns.join(", ") + " FROM " + table + ";";
    } else {
        sql = map.custom_sql;
    }
    log("Starting routine to query database.");
    log("SQL: " + sql);

    const query = connection.query(sql);

    query
        .on("error", throwSqlError)
        .on("result", (row) => {
            rowsCount++;
            processRow(log, csvWriteStream, all_columns, row, extra_columns, regionalized_columns);
        })
        .on("end", () => {
            connection.end();
            csvWriteStream.end();

            let rowsText;
            if (rowsCount > 1) {
                rowsText = rowsCount + " rows";
            } else {
                rowsText = rowsCount + " row";
            }

            log("Wrote " + rowsText + " to " + csvFilePath);

        });
};

const dbHostIsDefined = (region) => {
    let result = false;

    if (config.regional[region].hasOwnProperty("dbHost")) {
        const dbHost = config.regional[region].dbHost;
        if (typeof dbHost === "string") {
            if (dbHost.length > 0) {
                result = true;
            }
        }
    }
    return result;
};


(async () => {
    try {
        const credentials = {};

        credentials.s3 = await odinHelper.getS3Credentials(config.s3.credentialsOdinMaterialsSet);

        var regions = process.argv.slice(2);
        if (regions.length == 0) {
            regions = Object.keys(config.regional);
        }

        regions.forEach(async (region) => {
            try {
                if (dbHostIsDefined(region)) {
                    const odinMaterialSet = config.regional[region].dbCreds;
                    credentials.db = await odinHelper.getDbCredentials(odinMaterialSet);
                    config.tableColumnsMap.forEach((map) => {
                        exportDataToS3(region, credentials, map);
                    });
                }
            } catch (error) {
                console.error("Failed export in region" + region);
                console.error(error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();