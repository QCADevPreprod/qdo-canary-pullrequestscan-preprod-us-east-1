//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0


const AWS = require('aws-sdk');
const s3 = new AWS.S3();
// {fact rule=s3-copy-bucket-js-rule@v1.0 defects=1}
function non_compliant() {
    var params = {
        Bucket: "destinationbucket",
        CopySource: "/sourcebucket/HappyFacejpg",
        Key: "HappyFaceCopyjpg"
        //missing `ExpectedBucketOwner` and `ExpectedSourceBucketOwner`
       };
       s3.copyObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
            }
        );
}

// {/fact}

// {fact rule=s3-copy-bucket-js-rule@v1.0 defects=0}

function compliant() {
    var params = {
        Bucket: "destinationbucket",
        CopySource: "/sourcebucket/HappyFacejpg",
        Key: "HappyFaceCopyjpg",
        ExpectedBucketOwner: 'STRING_VALUE',
        ExpectedSourceBucketOwner: 'STRING_VALUE'
       };
       s3.copyObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
            }
        );
}

// {/fact}