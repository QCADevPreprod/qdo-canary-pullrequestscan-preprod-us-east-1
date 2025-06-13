var fs = require("fs");
const { chromium } = require("playwright");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const s3BucketName = process.env.ARTIFACT_BUCKET_NAME
const ddbTableName = process.env.CRAWLS_TABLE_NAME
AWS.config.update({ region: process.env.CRAWLS_TABLE_REGION });


const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// Our raven crawler version - to be incremeted by zra
const version = "0.1.1";

exports.lambdaHandler = async function (event, context) {

  // Our raven version
  console.log(`raven ${version}`);

  // Parse our SQS message for the SNS MessageId and Body
  event.Records.forEach((record) => {
    const { body } = record;
    var msgbod = JSON.parse(body);
    msgId = msgbod["MessageId"];
    url = msgbod["Message"];
  });

  let browser = null;

  try {
    // We'll use the SNS MessageId as the fileName
    const fileName = msgId;

    const browser = await chromium.launch({
      args: [
        "--single-process",
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--disk-cache-size=33554432",
        "--hide-scrollbars",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--remote-debugging-address=22233",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
      ],
      executablePath: "/var/task/chromium-956323/chrome-linux/chrome",
    });

    //const context = await browser.newContext({ignoreHTTPSError: true, recordHar: {path: harfile_path}});
    //const page = await context.newPage({acceptDownloads: true });

    var harfile_path = `/tmp/${fileName}.har`;
    const context = await browser.newContext({acceptDownloads: true, ignoreHTTPSError: true, recordHar: { path: harfile_path } });
    const page = await context.newPage();

    console.log("Processing MessageId: ", msgId);

    // Create a log file for all traffic network requests
    var logfile_path = `/tmp/${fileName}.traffic.txt`;

    // console.log("Traffic log file being written to: ", logfile_path)
    var logger = fs.createWriteStream(logfile_path, { flags: "a" });

    // Log and continue all network requests
    page.route("**", (route) => {
      logger.write(route.request().url() + "\n", null, "utf8");
      route.continue();
    });

    console.log("Crawling target url: ", url);
    await page.setDefaultNavigationTimeout(0);
    try {
      const response = await page.goto(url);
      console.log(`${url} responded with a `, response.status());
      var crawl_status_code = response.status();
    } catch (err) {
      console.log("Error in navigating to url / Unable to resolve")
      var crawl_status_code = "500";
    }

    // Building out our status report
    // Add a new field called "status" where we let the user know
    // if the domain doesn't exist, etc etc other errors
    const statusReport = {
      message_id: msgId,
      url: url,
      status_code: crawl_status_code,
    };

    // Generate execution timestamp
    var unix_time = Math.round(+new Date()/1000);

    if (crawl_status_code === 200) {

      // Capture the sites HTML source
      const htmlData = await page.content();
      console.log("Uploading the page source to S3 ...");

      // Write our crawled HTML data to S3
      await s3
        .putObject({
          Bucket: s3BucketName,
          Key: `${fileName}.html.txt`,
          Body: htmlData,
          Metadata: {
            'crawl_url': url,
            'msg_id': msgId,
            'unix_time': String(unix_time),
          },
        })
        .promise();

      // Take screenshot data for the visited site to S3
      const screenshotData = await page.screenshot({ fullPage: true });

      // Write the screenshot to S3
      console.log("Uploading the screenshot to S3 ...");
      await s3
        .putObject({
          Bucket: s3BucketName,
          Key: `${fileName}.png`,
          Body: screenshotData,
          Metadata: {
            'crawl_url': url,
            'msg_id': msgId,
            'unix_time': String(unix_time),
          },
        })
        .promise();

      // Write the traffic log to S3
      console.log("Uploading the traffic log to S3 ...");
      const logFileContent = fs.readFileSync(logfile_path);
      await s3
        .putObject({
          Bucket: s3BucketName,
          Key: `${fileName}.traffic.txt`,
          Body: logFileContent,
          Metadata: {
            'crawl_url': url,
            'msg_id': msgId,
            'unix_time': String(unix_time),
          },
        })
        .promise();

      // Close out our traffic logger
      logger.end();

      // HAR archive stuff
      await page.close();
      await context.close();

      //Write the HAR file S3
      console.log("Uploading the HAR file to S3 ...");
      const harFileContent = fs.readFileSync(harfile_path);
      await s3
        .putObject({
          Bucket: s3BucketName,
          Key: `${fileName}.har`,
          Body: harFileContent,
          Metadata: {
            'crawl_url': url,
            'msg_id': msgId,
            'unix_time': String(unix_time),
          },
        })
        .promise();

      var params = {
        TableName: ddbTableName,
        Item: {
          'crawl_id': { S: msgId },
          'crawl_target': { S: url },
          'status_code': {S:  String(crawl_status_code)},
          'crawl_time': {S: String(unix_time)},
        }
      };

      // Call DynamoDB to add the item to the table
      await ddb.putItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      }).promise;

    }

    // Call DynamoDB to add the item to the table for failures
    var params = {
      TableName: ddbTableName,
      Item: {
        'crawl_id': { S: msgId },
        'crawl_target': { S: url },
        'status_code': {S:  String(crawl_status_code)},
        'crawl_time': {S: String(unix_time)},
      }
    };
    await ddb.putItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    }).promise;

    // Write the status code for the visited site to S3
    // Make this the last thing to be written to S3
    // It will act as an indicator that the rest of the jobs are done
    console.log("Uploading crawl status report to S3 ...");
    await s3
      .putObject({
        Bucket: s3BucketName,
        Key: `${fileName}.json`,
        Body: JSON.stringify(statusReport),
        Metadata: {
          'crawl_url': url,
          'msg_id': msgId,
          'unix_time': String(unix_time),
        },
      })
      .promise();

    await browser.close();
    console.log("Crawl complete. Have a nice day.");

  } catch (error) {
    throw error;
  } finally {
    if (browser) {
      console.log("Crawl complete. Have a nice day.");
      await browser.close();
    }
  }
};