const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const _ = require("lodash");
const user = require("../models/user");
const prototype = require("../models/prototype");
const thumbnails = require("../util/sitethumbnails");
const infocard = require("../util/infocard");
const filesystem = require("../util/filesystem");
const extract = require("extract-zip");
const Settings = require("../Settings");

//set up a list of html files to treatments. There should be at least one
//treatment, the default. It'll just show up as the prototype link if there's only
//one. multiple treamtents will get displayed as such.
let addGuessedTreatment = (protoInfo, treatments, htmlPaths) => {
    treatments = treatments ? treatments : [];
    if (!htmlPaths || htmlPaths.length == 0) {
        return treatments;
    }

    let description = "T1";
    //index.htm(l) is default. if no index.htm(l), then first one in the errorList
    let indexes = [".framer/index.html", "index.html", "index.htm"];
    let candidates = [];
    htmlPaths.forEach(path => {
        indexes.some(index => {
            if (path.indexOf(index) > -1) {
                candidates.push(path);
                return true;
            }
        });
    });
    let path = candidates[0];

    //didn't find any index.htm(l), just use the first
    if (!path) {
        console.log("CANDIDATES: " + JSON.stringify(candidates));
        path = htmlPaths[0];
    }
    treatments.push({ urlPath: path, description: description, default: true });
    return treatments;
};

let validatePost = req => {
    let result = {};
    result.error = false;
    result.errorList = [];

    if (!req.body.accessKey) {
        result.error = true;
        result.errorList.push("Access key can't be blank.");
    }

    console.log(`req.body.prototypeName: ${req.body.prototypeName}`);
    if (
        req.body.prototypeName === undefined ||
        req.body.prototypeName.trim() == ""
    ) {
        result.error = true;
        result.errorList.push("Prototype name can't be blank.");
    }

    if (!req.file) {
        result.error = true;
        result.errorList.push("No File selected.");
    }

    if (
        !req.body.accessKey ||
        !user.findOne({ key: req.body.accessKey.trim() })
    ) {
        console.log(
            "access Key not matched: " +
            req.body.accessKey +
            "\n" +
            JSON.stringify(user)
        );
        result.error = true;
        result.errorList.push("Wrong access key given");
    }

    return result;
};

let get = {
    json: (req, res, next) => {
        if (req.query.userid) {
            return {
                status: 200,
                result: prototype
                    .find({ userid: req.query.userid, isUnlisted: false }, "updated_dt")
                    .reverse()
            };
        }
        if (req.query.accessKey) {
            let u = user.findOne({ key: req.query.accessKey.trim() });
            console.log(`found user ${JSON.stringify(u)}`);
            if (u == undefined) {
                return { status: 200, result: [] };
            } else {
                return {
                    status: 200,
                    result: prototype.find({ userid: u.userid }, "updated_dt").reverse()
                };
            }
        }
        return {
            status: 200,
            result: prototype.find({ isUnlisted: false }, "updated_dt").reverse()
        };
    }
};

let copyPrototype = async (path, destination) => {
    return new Promise((resolve, reject) => {
        console.log(`copying zip to ${destination}/prototype.zip`);
        fs.createReadStream(path)
            .pipe(fs.createWriteStream(`${destination}/prototype.zip`))
            .on("close", function() {
                resolve(`prototype.zip`);
            })
            .on("error", function(err) {
                reject(`could not copy prototype into place: ${err}`);
            });
    });
};

let updateInfoCards = async (treatments, proto) => {
    for (let treatment of treatments) {
        console.log(`updateInfoCards, treatment ${JSON.stringify(treatment)}`);
        let fullPath = `${Settings.prototypeFilePrefix(proto)}/${
            treatment.urlPath
        }`;
        let updatedIndex = await infocard.injectInfoCard(
            fullPath,
            infocard.infocardHtml(proto)
        );
        if (updatedIndex.err) {
            console.log("error updating index: " + updatedIndex.err);
        } else {
            //now to write it back to the file
            let writeOutput = await writeFileAsync(fullPath, updatedIndex.text);
            console.log(`updateInfoCards wrote updated file`);
        }
    }
};

let put = {
    json: async (req, res, next) => {
        let id = req.params.id || req.body.id;
        let result = prototype.update(req.body.id, req.body);
        //update thumbnails, update infocards
        let proto = prototype.find({ id: req.body.id })[0];
        if (!proto) {
            return next({
                status: 404,
                message: "No prototype was found with that id."
            });
        }
        console.log(
            "PUT got proto treatments: " + JSON.stringify(req.body.treatments)
        );
        if (req.body.treatments) {
            proto.treatments = _.unionBy(
                proto.treatments,
                req.body.treatments,
                "urlPath"
            );
        }
        await updateInfoCards(proto.treatments, proto);
        console.log("PUT adding thumbnail to proto: " + JSON.stringify(proto));
        await thumbnails.addThumbnailToProto(proto);
        return next({ status: 200, result });
        //TODO error handle
    }
};

let remove = {
    json: async (req, res, next) => {
        if (!user.findOne({ key: req.get("X-Proto-AccessKey").trim() })) {
            console.log(
                "access Key not matched: " +
                req.get("X-Proto-AccessKey").trim() +
                "\n" +
                JSON.stringify(user)
            );
            return next({ status: 400, message: "Wrong access key given" });
        }

        let result = prototype.remove(req.params.id);
        if (result === false) {
            return next({ status: 404, message: "Prototype not found" });
        }

        return next({ status: 204 });
    }
};

let post = async (req, res, next) => {
    let isDownloadable = false;
    if (req.body.shouldShare && req.body.shouldShare === "on") {
        isDownloadable = true;
    }

    const prototypeServerUrl = process.env.PROTO_SERVER_URL;
    let validationResult = validatePost(req);

    if (validationResult.error) {
        //iterate through validationResult and make it part of the message
        return next({ status: 400, message: validationResult.errorList });
    }

    let destinationDir = (key, prototypeName) => {
        let destDir =
            Settings.prototype_directory[process.env.NODE_ENV] || "defaultDir";
        let prototypeNme = "";
        destDir += `/${user.findOne({ key: key }).userid}/${prototypeName}`;
        return destDir;
    };

    let prototypeName = `${req.body.prototypeName.replace(/\W+/g, "")}`;
    let prototypeUser = user.findOne({ key: req.body.accessKey }).userid;
    let prototypeDestination = destinationDir(req.body.accessKey, prototypeName);

    console.log(
        `${prototypeUser} posting to prototype named ${
            req.body.prototypeName
        }, overwrite: ${req.body.shouldOverwrite}`
    );

    if (!req.body.shouldOverwrite || req.body.shouldOverwrite === "off") {
        if (prototype.findOne({ userid: prototypeUser, name: prototypeName })) {
            return next({
                status: 500,
                message:
                    "Prototype already exists. Go back and check 'overwrite' option to overwrite, or choose a new name."
            });
        }
    } else {
        //first nuke current dir:
        const rimraf = require("rimraf");
        rimraf.sync(prototypeDestination);
    }

    console.log(`creating dir ${prototypeDestination}`);
    extract(
        req.file.path,
        { dir: prototypeDestination, defaultFileMode: 420 },
        async function(err) {
            if (err) {
                console.error(err);
                return next({
                    status: 500,
                    message: `I sprung an error while extracting a zip: ${err.code}...`
                });
            }
            let htmlFiles = filesystem.htmlFiles(prototypeDestination, [
                "node_modules",
                ".git",
                ".viewer.html",
                "__MACOSX",
                ".DS_Store"
            ]);

            if (htmlFiles.length == 0) {
                return next({
                    status: 400,
                    message:
                        "I see no html files in your upload. Are you sure you are uploading a prototype?"
                });
            }

            let rootPath = process.env.PROTO_URL_PREFIX
                ? `${process.env.PROTO_URL_PREFIX}/${prototypeUser}`
                : prototypeUser;
            let prototypeUrl = `${prototypeServerUrl}/${rootPath}/${prototypeName}`;
            let prototypeFullPath = prototypeUrl;

            let source = req.body.source || req.headers.referer;
            let isUnlisted = req.body.isUnlisted === "on" ? true : false;
            let protoInfo = {
                name: prototypeName,
                description: req.body.description,
                userid: prototypeUser,
                source: source,
                isUnlisted: isUnlisted,
                htmlFiles: htmlFiles
            };

            //if the user passed indexPath, i.e. Sketch plugin, use it as the default treatment.
            protoInfo.treatments = req.body.indexPath
                ? [{ urlPath: req.body.indexPath, description: "default" }]
                : [];
            protoInfo.treatments.concat(
                req.body.treatments ? req.body.treatments : []
            );

            //provide this for those who simply want to link to the "default" treatment

            //we're gonna guess some potential index paths for the user, if they
            //gave us none
            if (!req.body.treatments && htmlFiles && htmlFiles.length > 0) {
                protoInfo.treatments = addGuessedTreatment(
                    protoInfo,
                    protoInfo.treatments,
                    htmlFiles
                );
            }
            protoInfo.defaultTreatmentUrl = Settings.treatmentUrl(protoInfo, 0);
            await updateInfoCards(protoInfo.treatments, protoInfo);
            protoInfo.downloadable = isDownloadable;
            protoInfo.downloadlink = `${prototypeUrl}/prototype.zip`;
            await thumbnails.addThumbnailToProto(protoInfo);

            if (isDownloadable) {
                let shareName = await copyPrototype(
                    req.file.path,
                    prototypeDestination
                );
                let shareUrl = `${prototypeUrl}/${shareName}`;
                protoInfo.shareUrl = shareUrl;
                let info = prototype.addOrUpdate(protoInfo);
                console.log({ status: 200, info });
                return next({ status: 200, info });
            } else {
                let info = prototype.addOrUpdate(protoInfo);
                console.log({ status: 200, info });
                return next({ status: 200, info });
            }
        }
    );
};

module.exports.get = get;
module.exports.post = post;
module.exports.put = put;
module.exports.delete = remove;