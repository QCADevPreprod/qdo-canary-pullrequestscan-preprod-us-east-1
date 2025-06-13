"use strict";

var express = require('express');
var path = require('path');
var fs = require('fs');
var util = require('util');
var url = require('url');
var AWS = require('aws-sdk');

var fs = require('fs');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');

const LIB_PATH = process.env.SERVER_ROOT + '/lib/commonjs';
const APP_PATH = LIB_PATH + '/mango-ios-press';

const exec = require('child_process').exec;
const cheerio = require('cheerio');
const request = require('request');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

const IPA_LIST_URL = 'https://electric-company.integ.amazon.com/search?utf8=%E2%9C%93&search%5Bpackage_full_name%5D=&search%5Bartifact_name%5D=Amazon+FreeTime+Enterprise&search%5Bversion_set_full_name%5D=FreeTimeReactNativeApp%2Frelease&search%5Btype%5D=&search%5Bos%5D=&search%5Bbranch%5D=&search%5Btag%5D=&search%5Bbuild_id%5D=&search%5Bapp_identifier%5D=&commit=Search';
const IPA_LIST_OBJ = {
    url: IPA_LIST_URL,
    strictSSL: false
};

const DEV_IPA_LIST_URL = 'https://electric-company.integ.amazon.com/search?utf8=%E2%9C%93&search%5Bpackage_full_name%5D=&search%5Bartifact_name%5D=Amazon+FreeTime+Enterprise&search%5Bversion_set_full_name%5D=FreeTimeReactNativeApp%2Fdevelopment&search%5Btype%5D=&search%5Bos%5D=&search%5Bbranch%5D=&search%5Btag%5D=&search%5Bbuild_id%5D=&search%5Bapp_identifier%5D=&commit=Search';
const DEV_IPA_LIST_OBJ = {
    url: DEV_IPA_LIST_URL,
    strictSSL: false
};

const DEV_ANROID_LIST_URL = 'https://devcentral.amazon.com/ac/brazil/package-master/package/browse/FreeTimeReactAndroidApp';

module.exports = (function () {
    "use strict";
    var api = express.Router();

    api.get('/get-ipa-list', function (req, res) {
        request(IPA_LIST_OBJ, function (error, response, html) {
            handleIPAListHtmlResponsefunction(res, error, response, html)
        });
    });

    api.get('/get-dev-ipa-list', function (req, res) {
        request(DEV_IPA_LIST_OBJ, function (error, response, html) {
            handleIPAListHtmlResponsefunction(res, error, response, html)
        });
    });

    api.get('/get-dev-android-list', function (req, res) {
        console.log(req.headers)

        const options = extractAndForwardCookie(req, DEV_ANROID_LIST_URL);
        console.log('options', options);
        request(options, function (error, response, html) {
            handleAndroidListHtmlResponse(res, error, response, html)
        });
    });

    api.get('/publish-ipa', function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var where = query.where;
        var ipa_url = query.ipa;
        var version = query.vs;
        var vsVersion = query.version;
        var valid = parseInt(query.valid);

        publishIPA(where, ipa_url, res, valid, vsVersion, function (itms_link) {
            res.send(itms_link);
            getInternalKeyAndSecret(function (obj) {
                getSlackWebhookUrl(obj, function (slackWebhookUrl) {
                    notifySlack(where, version, itms_link, valid, vsVersion, slackWebhookUrl);
                });
            });
        });
    });

    api.get('/upload-dsym-file', function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var appVersion = query.appVersion;
        var dsymUrl = query.dsymUrl;

        downloadDSYM(dsymUrl, res, function (folderPath, filePath) {
            extractdSYM(folderPath, filePath, appVersion, function (filePath, fileName) {
                getDSYMKeyAndSecret(res, function (ksObject) {
                    uploadDSYMFileToS3(ksObject, filePath, fileName, function (uploadLocation) {
                        res.send('Successful! Uploaded to ' + uploadLocation);
                    });
                });
            });
        });

    });

    api.post('/apk-upload', upload.single('apk'), function (req, res) {
        const valid = req.body.days;
        const apkPath = '/tmp/' + req.file.originalname;
        const where = 'dunno';
        const vsVersion = req.body.vsVersion;
        let target = __dirname + '/test';
        extract(req.file.path, { dir: target }); 
        
        getInternalKeyAndSecret(function (obj) {
            doUploadAPK(obj, apkPath, where, valid, (presignedUrl) => {
                getSlackWebhookUrl(obj, function (slackWebhookUrl) {
                    notifySlackAPK(req.file.originalname, presignedUrl, valid, vsVersion, slackWebhookUrl);
                });
                res.status(200).send(presignedUrl);
            });
        });
    });

    return api;
})();

function extractAndForwardCookie(req, url) {
    const cookie = req.header('Cookie');
    const language = req.header('Accept-Language');
    const encoding = req.header('Accept-Encoding');
    const accept = req.header('Accept');
    const ua = req.header('User-Agent');
    const secure = req.header('Upgrade-Insecure-Requests');

    const headers = {
        'Upgrade-Insecure-Requests': secure,
        'User-Agent': ua,
        'Accept': accept,
        'Accept-Encoding': encoding,
        'Accept-Language': language,
        'Cookie': cookie
    }

    const options = {
        url: url,
        strictSSL: false,
        followAllRedirects: true,
        headers: headers
    }

    return options;
}

function uploadDSYMFileToS3(ksObject, filePath, fileName, callback) {
    configAWS(ksObject);
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    const bucket = 'ios-crashlogservice/dsym/sync/nightly';
    const key = fileName + '/' + fileName;

    uploadIPAToS3(s3, filePath, undefined, bucket, key, function (uploadLocation) {
        if (callback) {
            callback(uploadLocation);
        }
    });
}

function extractdSYM(folderPath, filePath, appVersion, callback) {
    exec('tar -xvzf ' + filePath + ' -C ' + folderPath + ' && mv ' + folderPath + '/FreeTime.app.dSYM/Contents/Resources/DWARF/FreeTime  ' + folderPath + '/FreeTime' + appVersion, (err, stdout, stderr) => {
        if (err) {
            console.error('unable to extractdSYM', err);
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        if (callback) {
            callback(folderPath + '/FreeTime' + appVersion, 'FreeTime' + appVersion);
        }
    });
}

function getDSYMKeyAndSecret(res, callback) {
    exec('/apollo/env/envImprovement/bin/odin-get "com.amazon.access.AIV IOS AWS-dsym-upload-freetime-1"', (err, stdout, stderr) => {
        if (err) {
            console.error('getDSYMKeyAndSecret', err);
            res.send('Unable to getDSYMKeyAndSecret');
            return;
        }

        parseKeyAndSecrect(stdout, callback);
    });
}

function handleIPAListHtmlResponsefunction(res, error, response, html) {

    if (!error) {
        const $ = cheerio.load(html);
        const result = [];
        $('a.has-app-icon').each(function (index, element) {
            const href = $(this).attr('href');
            const build = $('p.package-build', this).text().trim();
            const vs = $('p.version-set', this).text().trim();
            const time = new Date($('time', this).text()).getTime();

            result.push({
                href: getIPADownloadUrl(href),
                buildName: getBuildName(build),
                buildNo: getBuildNumber(build),
                vs: vs,
                time: time
            });
        });

        res.send(result);
    } else {
        res.status(500).send("Unable to get IPA list");
    }
}

function handleAndroidListHtmlResponse(res, error, response, html) {
    if (!error) {
        const $ = cheerio.load(html);
        const result = [];
        $('a').each(function (index, element) {
            const a = $(this);
            const href = a.attr('href');

            const regex = /^https:\/\/devcentral\.amazon\.com\/ac\/brazil\/package-master\/package\/browse\/FreeTimeReactAndroidApp\//g
            if (href.match(regex)) {
                const version = a.text().trim();

                result.push({
                    href: href + "/RHEL5_64",
                    buildName: version
                });
            }
        });

        res.send(result);
    } else {
        res.status(500).send("Unable to get Android APK list");
    }

}


const BASE_URL = 'https://electric-company.integ.amazon.com';
const IPA_NAME = 'signed.ipa';

function notifySlack(where, version, itms_link, days, vsVersion, webhookUrl) {
    var options = {
        uri: webhookUrl,
        method: 'POST',
        json: {
            "Content": vsVersion + ': FreeTimeiOSApp ' + version + ' valid for ' + days + ' days is published with install link ' + itms_link
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.id) // Print the shortened url.
        }
    });
}

function notifySlackAPK(name, url, days, vsVersion, webhookUrl) {
    var options = {
        uri: webhookUrl,
        method: 'POST',
        json: {
            "Content": vsVersion + ": " + name + ' valid for ' + days + ' days is published with install link ' + url
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.id) // Print the shortened url.
        }
    });
}

function getIPADownloadUrl(url) {
    if (url) {
        return BASE_URL + url.split("?")[0] + '/' + IPA_NAME;
    }
}

function getBuildName(build) {
    if (build) {
        return build.split('-')[0];
    }
}

function getBuildNumber(build) {
    if (build) {
        return build.split('-')[1];
    }
}

function publishIPA(where, ipaUrl, res, valid, vsVersion, callback) {
    downloadIPA(ipaUrl, res, function (ipaPath) {
        // if (where == 'beta') {
        //     getBetaKeyAndSecret(function(obj) {
        //         doUpload(obj, ipaPath, where, callback);
        //     });
        // } else if (where == 'internal') {
        getInternalKeyAndSecret(function (obj) {
            doUpload(obj, ipaPath, where, valid, vsVersion, callback);
        });
        // }
    });
}

function doUploadAPK(awsInfo, apkPath, where, valid, callback) {
    configAWS(awsInfo);

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    const bucket = 'internal-release';
    const key = Date.now() + "/" + apkPath.substr('/tmp/'.length);

    uploadIPAToS3(s3, apkPath, where, bucket, key, function () {
        const presignedUrl = presignUrl(s3, bucket, key, valid);
        console.log('presignedUrl', presignedUrl);

        callback(presignedUrl);
    });
}

function getSlackWebhookUrl(awsInfo, callback) {
    configAWS(awsInfo);
    const secretName = "arn:aws:secretsmanager:us-east-1:480184054405:secret:SlackSecrets-Jo2MtB";
    const secretsManager = new AWS.SecretsManager();

    secretsManager.getSecretValue({SecretId: secretName}, function(err, data) {
        if (err) {
            console.log("Error: ", err);
        }
        if ('SecretString' in data) {
            console.log("Retrieving from Secrets Manager...");
            if(callback) {
                callback(data.SecretString);
            }
        }
    });
}

function doUpload(awsInfo, ipaPath, where, valid, vsVersion, callback) {
    configAWS(awsInfo);

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    const bucket = 'internal-release';
    const key = ipaPath.substr('/tmp/'.length);
    const xmlPath = ipaPath.substr(0, ipaPath.length - 'FreeTime.app.ipa'.length) + 'app.plist';
    const xmlKey = xmlPath.substr('/tmp/'.length);

    uploadIPAToS3(s3, ipaPath, where, bucket, key, function () {
        const presignedUrl = presignUrl(s3, bucket, key, valid);
        console.log('presignedUrl', presignedUrl);

        editAndSaveXML(presignedUrl, xmlPath, vsVersion, function () {
            uploadXMLToS3(s3, xmlPath, where, bucket, xmlKey, function (xmlUrl) {
                const file_url = xmlUrl;
                console.log(file_url);
                const itms_link = 'itms-services://?action=download-manifest&amp;url=' + file_url;
                console.log(itms_link);

                if (callback) {
                    callback(itms_link);
                }
            });
        });
    });
}

function publishXML(s3, bucket, xmlKey, callback) {
    var params = {
        ACL: 'public-read',
        Bucket: bucket,
        Key: xmlKey
    };

    s3.putObjectAcl(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
            if (callback) {
                callback();
            }
        }

    });
}

function editAndSaveXML(presignedUrl, xmlPath, vsVersion, callback) {
    // fs.readFile(path.join(APP_PATH, 'public/routes/app.plist'), 'utf-8', function(err, data) {
    //     if (err) console.log(err);
    //     // we log out the readFile results    
    //     console.log(data);
    //     // we then pass the data to our method here
    //     parseString(data, function(err, result) {
    //         if (err) console.log(err);

    //         var json = result;

    //         json.plist.dict[0].array[0].dict[0].array[0].dict[0].string[1] = presignedUrl;

    //         // create a new builder object and then convert
    //         // our json back to xml.


    //         var builder = new xml2js.Builder();
    //         var xml = builder.buildObject(json);

    //         fs.writeFile(xmlPath, xml, function(err, data) {
    //             if (err) console.log(err);

    //             console.log("successfully written our update xml to file");

    //             if (callback) {
    //                 callback();
    //             }
    //         })

    //     });
    // });

    let xml = '';

    if (vsVersion == 'RELEASE') {
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
<dict>\n\
    <key>items</key>\n\
    <array>\n\
        <dict>\n\
            <key>assets</key>\n\
            <array>\n\
                <dict>\n\
                    <key>kind</key>\n\
                    <string>software-package</string>\n\
                    <key>url</key>\n\
                    <string>' + presignedUrl.replace(/&/g, '&amp;') + '</string>\n' +
            '                </dict>\n\
            </array>\n\
            <key>metadata</key>\n\
            <dict>\n\
                <key>bundle-identifier</key>\n\
                <string>com.amazon.northstar.FreeTime.Beta</string>\n\
                <key>bundle-version</key>\n\
                <string>4</string>\n\
                <key>kind</key>\n\
                <string>software</string>\n\
                <key>subtitle</key>\n\
                <string>Amazon</string>\n\
                <key>title</key>\n\
                <string>FreeTime</string>\n\
            </dict>\n\
        </dict>\n\
    </array>\n\
</dict>\n\
</plist>\n';
    } else if (vsVersion == 'DEVELOPMENT') {
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
<dict>\n\
    <key>items</key>\n\
    <array>\n\
        <dict>\n\
            <key>assets</key>\n\
            <array>\n\
                <dict>\n\
                    <key>kind</key>\n\
                    <string>software-package</string>\n\
                    <key>url</key>\n\
                    <string>' + presignedUrl.replace(/&/g, '&amp;') + '</string>\n' +
            '                </dict>\n\
            </array>\n\
            <key>metadata</key>\n\
            <dict>\n\
                <key>bundle-identifier</key>\n\
                <string>com.amazon.northstar.FreeTime.dev</string>\n\
                <key>bundle-version</key>\n\
                <string>4</string>\n\
                <key>kind</key>\n\
                <string>software</string>\n\
                <key>subtitle</key>\n\
                <string>Amazon</string>\n\
                <key>title</key>\n\
                <string>FreeTime</string>\n\
            </dict>\n\
        </dict>\n\
    </array>\n\
</dict>\n\
</plist>\n';
    }

    fs.writeFile(xmlPath, xml, function (err, data) {
        if (err) console.log(err);

        console.log("successfully written our update xml to file");

        if (callback) {
            callback();
        }
    })

}

function presignUrl(s3, bucket, key, valid) {
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: valid * 24 * 3600
    });

    return url;
}

function uploadXMLToS3(s3, xmlPath, where, bucket, key, callback) {
    var uploadParams = {
        ACL: 'public-read',
        Bucket: bucket,
        Key: key,
        Body: ''
    };
    var file = xmlPath;

    var fs = require('fs');
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;

    //var path = require('path');
    //uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        }
        if (data) {
            console.log("Upload Success", data.Location);
            if (callback) {
                callback(data.Location);
            }
        }
    });
}

function uploadIPAToS3(s3, ipaPath, where, bucket, key, callback) {
    // call S3 to retrieve upload file to specified bucket


    var uploadParams = { Bucket: bucket, Key: key, Body: '' };
    var file = ipaPath;

    var fs = require('fs');
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;

    //var path = require('path');
    //uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        }
        if (data) {
            console.log("Upload Success", data.Location);
            if (callback) {
                callback(data.Location);
            }
        }
    });
}

function configAWS(awsInfo) {
    AWS.config.update({
        region: 'us-east-1',
        accessKeyId: awsInfo.k,
        secretAccessKey: awsInfo.s
    });
}

function getPath(folderName) {
    return '/tmp/' + folderName;
}

function createFolder() {
    var folderName = '' + Date.now();

    exec('mkdir ' + getPath(folderName), (err, stdout, stderr) => {
        if (err) {
            console.error('createFolder', err);
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });

    return getPath(folderName);
}

function downloadIPA(ipaUrl, res, callback) {
    const to = createFolder() + '/FreeTime.app.ipa';
    exec('wget --no-check-certificate ' + encodeURI(ipaUrl) + ' -O ' + to, (err, stdout, stderr) => {
        if (err) {
            console.error('downloadIPA', err);
            res.send('Unable to downloadIPA');
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        if (callback) {
            callback(to);
        }
    });
}

function downloadDSYM(dsymUrl, res, callback) {
    const folderPath = createFolder();
    const to = folderPath + '/FreeTime.app.dSYM.tgz';
    exec('wget --no-check-certificate ' + encodeURI(dsymUrl) + ' -O ' + to, (err, stdout, stderr) => {
        if (err) {
            console.error('downloaddSYM', err);
            res.send('Unable to downloaddSYM');
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        if (callback) {
            callback(folderPath, to);
        }
    });
}

function getInternalKeyAndSecret(callback) {
    exec('/apollo/env/envImprovement/bin/odin-get com.amazon.access.aws-freetime-northstar-s3-readonly-1', (err, stdout, stderr) => {
        if (err) {
            console.error('getInternalKeyAndSecret', err);
            res.send('Unable to getInternalKeyAndSecret');
            return;
        }

        parseKeyAndSecrect(stdout, callback);
    });
}

function getBetaKeyAndSecret(callback) {
    exec('/apollo/env/envImprovement/bin/odin-get com.amazon.access.aws-freetime-northstar-s3-readonly-1', (err, stdout, stderr) => {
        if (err) {
            console.error('getBetaKeyAndSecret', err);
            res.send('Unable to getBetaKeyAndSecret');
            return;
        }
    });
}

function parseKeyAndSecrect(output, callback) {
    if (output) {
        const split = output.split('\n');


        if (callback) {
            callback({
                k: split[0],
                s: split[1]
            });
        }
    }
}