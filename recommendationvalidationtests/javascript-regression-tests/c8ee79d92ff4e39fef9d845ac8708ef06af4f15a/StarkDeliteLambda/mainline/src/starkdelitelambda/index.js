const mime = require("mime-types");
const path = require("path");
const interceptor = require("midway-lambda-interceptor");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const { API_PREFIX, STATUS_CODE, TEXT_MIMES } = require("./constants");
const { OMWBeanClient } = require("./omwbean_client.js");

const main = function (event, context, lambdaCallback) {
  const { path, httpMethod } = event;
  const responseType = `application/json`;
  console.log("DeliteLogger:: Main initialized");
  console.log('DeliteLogger:: ', event.headers[`X-FORWARDED-USER`], ' requested for ', path);
  switch (path) {
    case `${API_PREFIX}/username`:
      const response = JSON.stringify({
        username: event.headers[`X-FORWARDED-USER`],
      });
      return serveResponse(STATUS_CODE.SUCCESS, response, responseType, lambdaCallback);
    case `${API_PREFIX}/getFraudDetectedDeliveryPersons`:
      const omwBeanClient = new OMWBeanClient();
      omwBeanClient.getFraudDetectedDeliveryPersons()
        .then((data) => {
          serveResponse(STATUS_CODE.SUCCESS, JSON.stringify({ transportPlan: data }), responseType, lambdaCallback);
        })
        .catch((error) => {
          serveResponse(STATUS_CODE.INERNAL_SERVER_ERROR, JSON.stringify({ error: error }), responseType, lambdaCallback);
        });
      break;
    default:
      return serveArtifacts(event, context, lambdaCallback);
  }
};

const serveResponse = function (statusCode, body, contentType, lambdaCallback, isBase64Encoded = false) {
  lambdaCallback(null, {
    statusCode,
    isBase64Encoded,
    body,
    headers: {
      "Content-Type": contentType,
    },
  });
};

const serveArtifacts = function (event, context, lambdaCallback) {
  // Set urlPath
  let urlPath;
  if (event.path === `/`) {
    return serveIndex(event, context, lambdaCallback);
  } else {
    urlPath = event.path;
  }

  // Determine the file's key path within the additional artifacts directory
  const fileKey = path.join(process.env.ADDITIONAL_ARTIFACTS_S3_PATH, urlPath);
  const mimeType = mime.lookup(fileKey);
  const responseType = `application/json`;

  // Make sure the user doesn't try to break out of the additional_artifacts directory
  if (!fileKey.startsWith(process.env.ADDITIONAL_ARTIFACTS_S3_PATH)) {
    console.error("DeliteLogger:: forbidden access", fileKey);
    return serveResponse(
      STATUS_CODE.FORBIDDEN,
      JSON.stringify({ message: "forbidden" }),
      responseType,
      lambdaCallback
    );
  }

  // Get file from S3 and serve it
  getS3FileObject(process.env.CODE_S3_BUCKET, fileKey)
    .then((data) => {
      if (TEXT_MIMES.includes(mimeType)) {
        return serveResponse(
          STATUS_CODE.SUCCESS,
          data.toString(),
          mimeType,
          lambdaCallback
        );
      } else {
        return serveResponse(
          STATUS_CODE.SUCCESS,
          data.toString("base64"),
          mimeType,
          lambdaCallback,
          true
        );
      }
    })
    .catch((error) => {
      console.log('DeliteLogger:: Error retriving S3 File object ', error);
      return serveResponse(
        STATUS_CODE.NOT_FOUND,
        JSON.stringify({ message: "not found" }),
        responseType,
        lambdaCallback
      );
    });
};

const getS3FileObject = function (bucket, key) {
  return new Promise((resolve, reject) => {
    s3.getObject({
        Bucket: bucket,
        Key: key,
      },
      (err, data) => {
        if (err) {
          console.log(`DeliteLogger:: Error getting object: ${bucket} : ${key}`);
          return reject(err);
        } else {
          resolve(data.Body);
        }
      }
    );
  });
};

const serveIndex = function (event, context, lambdaCallback) {
  // S3 location of index file
  const responseType = `application/json`;
  const indexBucket = process.env.CODE_S3_BUCKET;
  const indexKey = path.join(
    process.env.ADDITIONAL_ARTIFACTS_S3_PATH,
    "index.html"
  );
  // Get file from S3 and serve it
  getS3FileObject(indexBucket, indexKey)
    .then((data) => {
      const content = data
        .toString()
        .replace(/__username__/g, event.headers["X-FORWARDED-USER"]);
      return serveResponse(
        STATUS_CODE.SUCCESS,
        content,
        "text/html",
        lambdaCallback
      );
    })
    .catch((error) => {
      console.log('DeliteLogger:: Error retriving S3 file object ', error);
      return serveResponse(
        STATUS_CODE.INERNAL_SERVER_ERROR,
        JSON.stringify({ message: "Internal server error" }),
        responseType,
        lambdaCallback
      );
    });
};

exports.handler = interceptor.makeInterceptor(main);