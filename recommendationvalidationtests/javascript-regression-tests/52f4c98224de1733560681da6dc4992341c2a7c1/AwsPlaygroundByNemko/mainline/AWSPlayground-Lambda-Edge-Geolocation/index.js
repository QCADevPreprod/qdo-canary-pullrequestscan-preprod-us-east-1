'use strict';

var AWS = require('aws-sdk');
var https = require('https');

exports.handler = (event, context, callback) => {

    const request = event.Records[0].cf.request;

    if (request.uri == '/' || request.uri == '/index.html') {
        let clientIp = request.clientIp;

        https.get('https://api.ipgeolocation.io/ipgeo?apiKey=d49a7c8b3d8d42a4ac9fabce73744083&ip=' + clientIp,
            function (res) {

                res.on("data", function (chunk) {
                    try {
                        var obj = JSON.parse(chunk);

                        const region = 'us-east-1'; // The region containing the DDB table that should be queried.
                        const dynamoConfig = {
                            sessionToken: process.env.AWS_SESSION_TOKEN,
                            region: region
                        };
                        const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
                        const ddbTable = 'awsplayground-visitors';

                        var dateObj = new Date();
                        var month = dateObj.getUTCMonth() + 1; //months from 1-12

                        // Enter new value in the visitors table
                        let params = {
                            TableName: ddbTable,
                            Item: {
                                client_ip: clientIp,
                                month: month,
                                country: obj.country_name
                            }
                        };

                        docClient.put(params, function (err, data) {
                            if (err) {
                                console.log("New entry to awsplayground-visitors failes: " + err);
                            }
                        });

                        // Update visitors stats table (totalCount)
                        updateVisitorsStatsTable(docClient);

                        // Update visitors months table
                        updateVisitorsMonthsTable(docClient, month);

                        // Update visitors countries table
                        updateVisitorsCountriesTable(docClient, obj.country_name);
                    }
                    catch (e) {
                        console.log("entering catch block");
                        console.log(e);
                        console.log(chunk);
                    }
                });

            }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    }

    callback(null, request);
};

function updateVisitorsMonthsTable(docClient, month) {
    var countMonths = 0;
    var monthsPromise = searchMonthsTable(docClient, month);
    monthsPromise.then(function (result) {
        if (isEmpty(result)) {
            countMonths = 0;
        } else {
            countMonths = Number(result.Item.totalCount);
        }
    }, function (err) {
        console.log(err);
    }).then(function (result) {
        if (countMonths === 0) {
            // If the month doesn't exist, add it
            let paramsAdd = {
                TableName: 'awsplayground-visitors-months',
                Item: {
                    month: month,
                    totalCount: 1
                }
            };
            docClient.put(paramsAdd, function (err, data) {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            // If the month exists, increment the count
            let paramsUpdate = {};
            paramsUpdate = {
                TableName: "awsplayground-visitors-months",
                Key: {
                    month: month
                },
                UpdateExpression: 'set totalCount = :c',
                ExpressionAttributeValues: {
                    ':c': countMonths+1
                },
                ReturnValues: "UPDATED_NEW"
            };
            docClient.update(paramsUpdate, function (err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                }
            });
        }
    });
}

function updateVisitorsCountriesTable(docClient, country) {
    var countCountry = 0;
    var countryPromise = searchCountriesTable(docClient, country);
    countryPromise.then(function (result) {
        if (isEmpty(result)) {
            countCountry = 0;
        } else {
            countCountry = Number(result.Item.totalCount);
        }
    }, function (err) {
        console.log(err);
    }).then(function (result) {
        if (countCountry === 0) {
            // If the country doesn't exist, add it
            let paramsAdd = {
                TableName: 'awsplayground-visitors-countries',
                Item: {
                    country: country,
                    totalCount: 1
                }
            };
            docClient.put(paramsAdd, function (err, data) {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            // If the country exists, increment the count
            let paramsUpdate = {};
            paramsUpdate = {
                TableName: "awsplayground-visitors-countries",
                Key: {
                    country: country
                },
                UpdateExpression: 'set totalCount = :c',
                ExpressionAttributeValues: {
                    ':c': countCountry+1
                },
                ReturnValues: "UPDATED_NEW"
            };
            docClient.update(paramsUpdate, function (err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                }
            });
        }
    });
}

function updateVisitorsStatsTable(docClient) {
    var totalCount = 0;
    // Read visitors stats asynchronously via promises
    var visitorsPromise = readVisitorStats(docClient);
    visitorsPromise.then(function (result) {
        totalCount = result.Item.totalCount;
        totalCount += 1;
    }, function (err) {
        console.log(err);
    }).then(function (result) {
        // update awsplayground-visitors-stats table
        let paramsStats = {};
        paramsStats = {
            TableName: "awsplayground-visitors-stats",
            Key: {
                stat: "count"
            },
            UpdateExpression: 'set totalCount = :t',
            ExpressionAttributeValues: {
                ':t': totalCount
            },
            ReturnValues: "UPDATED_NEW"
        };
        docClient.update(paramsStats, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            }
        });
    });
}

function readVisitorStats(docClient) {
    var paramsStatsRead = {
        TableName: 'awsplayground-visitors-stats',
        Key: {
            stat: "count"
        }
    };
    // Return new promise
    return new Promise(function (resolve, reject) {
        // Call DynamoDB asynchronously to read from the awsplayground-visitors-stats table
        docClient.get(paramsStatsRead, function (err, data) {
            if (err) {
                console.log("ERROR:" + err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function searchMonthsTable(docClient, month) {
    var paramsMonthsRead = {
        TableName: 'awsplayground-visitors-months',
        Key: {
            month: month
        }
    };
    // Return new promise
    return new Promise(function (resolve, reject) {
        // Call DynamoDB asynchronously to read from the awsplayground-visitors-months table
        docClient.get(paramsMonthsRead, function (err, data) {
            if (err) {
                console.log("ERROR:" + err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function searchCountriesTable(docClient, country) {
    var paramsCountriesRead = {
        TableName: 'awsplayground-visitors-countries',
        Key: {
            country: country
        }
    };
    // Return new promise
    return new Promise(function (resolve, reject) {
        // Call DynamoDB asynchronously to read from the awsplayground-visitors-country table
        docClient.get(paramsCountriesRead, function (err, data) {
            if (err) {
                console.log("ERROR:" + err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}