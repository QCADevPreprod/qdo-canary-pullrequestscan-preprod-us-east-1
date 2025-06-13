'use strict';

const AWS = require('aws-sdk');
const crypto = require("crypto");
const s3 = new AWS.S3();
const kms = new AWS.KMS();

const keyARN = process.env.CMK_KEY_ARN;  // arn:aws:kms:ap-southeast-2:291473993007:key/765f680b-3347-48ae-b6b1-338316ce6ed7
const keysBucketName = process.env.KEYS_BUCKET_NAME; // amlps-keys
const keysFileName = process.env.KEYS_FILE_NAME; // public_key.pem


exports.handler = (event, context, callback) => {

    var payload = event;
    var payloadString = JSON.stringify(payload).toString("utf8");
    console.log(payloadString)

    const paramsS3 = {
        Bucket: keysBucketName,
        Key: keysFileName
    };

    var pubKey = "";
    var encResultKey = "";

    s3.getObject(paramsS3, (err, data) => {
        if (err) {
            console.log("Error getting object");
        } else {

            pubKey = data.Body.toString();

    var encResultPayload = '';

    var paramsDataKey = {
        KeyId: keyARN,
        KeySpec: "AES_128"
    };

    kms.generateDataKey(paramsDataKey, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            var pt = data.Plaintext;
            var ptstr = JSON.stringify(pt);
            var dataKey = (JSON.parse(ptstr)).data;
            var dataKeyBuffer = new Buffer(dataKey);

            // Encrypt the datakey
            var encryptedKey = crypto.publicEncrypt(pubKey, dataKeyBuffer);
            var encryptedKeyBase64 = encryptedKey.toString("base64");
            //console.log("datakey: " + dataKey);

            // Encrypt the payload
            var algorithm = 'aes-256-cbc';
            var inputEncoding = 'utf8';
            var outputEncoding = 'base64';
            var initialisationVector = "";
            const IV_LENGTH = 16;
            initialisationVector = crypto.randomBytes(IV_LENGTH)
            var initialisationVectorString = initialisationVector.toString("hex").slice(0, 16)
            //console.log("initialisationVector: " + initialisationVectorString);

            var cipher = crypto.createCipheriv(algorithm, dataKeyBuffer, initialisationVectorString);
            var encryptedPayloadBase64 = cipher.update(payloadString, inputEncoding, outputEncoding);
            encryptedPayloadBase64 += cipher.final(outputEncoding);

            // Encrypt the IV
            var ivKeyBuffer = new Buffer(initialisationVectorString);
            var encryptedIV = crypto.publicEncrypt(pubKey, ivKeyBuffer);
            var encryptedIVBase64 = encryptedIV.toString("base64");

            // Create return object
            var returnObject = {
                key: encryptedKeyBase64,
                data: encryptedPayloadBase64,
                iv: encryptedIVBase64
            };

            // return object back
            callback(null, returnObject);
        }
    });
}
});
};