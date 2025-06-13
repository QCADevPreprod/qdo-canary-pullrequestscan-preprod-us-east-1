"use strict";
 
 const express = require("express");
 const cookieParser = require("cookie-parser");
 const http = require("http");
 const fs = require("fs");
 const querystring = require("querystring");
 const upload = require("express-fileupload");
 const ARCHelper = require("./src/ARCHelper");
 let cnamesMap = {};
 
 //create express server
 const control_app = express();
 control_app.use(cookieParser());
 control_app.use(upload());
 
 //config
 const HOST = "cdnlabcontrol.frontier.a2z.com";
 const PORT = 5000;
 control_app.use("/css", express.static("./node_modules/bootstrap/dist/css"));
 control_app.use("/js", express.static("./node_modules/bootstrap/dist/js"));
 control_app.use("/js", express.static("./node_modules/jquery/dist"));
 control_app.set("view engine", "ejs");
 const arcHelper = new ARCHelper();
 
 //ROUTES
 control_app.get("/", (req, res) => {
     res.render("arcUpload");
 });
 
 //Upload arcJson file and validate with validateARCJson
 //If arcJson is invalid, error message will be sent
 //If upload the same ARCJson, old file will be overwritten
 function non_conformant(){control_app.post("/", (req, res) => {
     let file = req.files.file;
     let domain = req.body.domain;
     let cnames = req.body.cnames;
     cnames = cnames
         .trim()
         .split(/[\s,]+/)
         .join();
     let filename = domain + ".json";
     file.mv(__dirname + "/uploads/" + filename, async (err) => {
         if (err) {
             res.send(err);
         } else {
             let arcJSON = __dirname + "/uploads/" + filename;
             const { isValid, errorMessage } = await arcHelper.validateARCJSON(
                 arcJSON
             );
             if (isValid === false) {
                 fs.unlink(arcJSON, (err) => {
                     if (err) throw err;
                 });
                 return res.status(400).send(errorMessage);
             }
             try {
                 cnames = checkCnames(domain, cnames);
                 await writeToCnameFile(domain, cnames);
             } catch (errorMessage) {
                 return res.status(400).send("cnames are incorrect");
             }
             await sendRequestToAppConfig(filename, cnames);
             res.render("uploadSuccess");
         }
     });
 });}
 
 async function loadCnameMap() {
     try {
         let content = fs.readFileSync("cnames.txt", "utf8");
         if (content === "") return;
         content = content.trim().split("\r\n");
         content.forEach((data) => {
             data = data.split(":");
             let cnames = data[1];
             let domain = data[0];
             cnames = cnames.split(",");
             cnames.forEach((cname) => {
                 cnamesMap[cname] = domain;
             });
         });
     } catch (err) {
         console.log(err);
     }
 }
 
 function checkCnames(domain, cnames) {
     cnames = cnames.split(",");
     let i = cnames.length;
     while (i--) {
         if (cnamesMap[i] === undefined) {
             cnamesMap[i] = domain;
             console.log("add new cname, ", i);
         } else {
             console.log("existing cnames: ", cnamesMap[i]);
             if (cnamesMap[i] === domain) {
                 if (i > -1) {
                     cnames.splice(i, 1);
                 }
                 console.log("cname existed, no change made");
             } else {
                 throw new Error("cname existed, belong to another domain");
             }
         }
     }
     return cnames.join();
 }
 
 async function writeToCnameFile(domain, cnames) {
     if (cnames === "") return;
     let content = domain + ":" + cnames + "\r\n";
     try {
         fs.writeFileSync(__dirname + "/cnames.txt", content, { flag: "a+" });
     } catch (err) {
         console.log(err);
     }
 }
 
 // send get request with filename so AppConfig will update it's dictionary.
 function sendRequestToAppConfig(filename, cnames) {
     const requestUrl = new URL("http://cdnlabconfig.frontier.a2z.com:4000");
     requestUrl.pathname = "/";
     requestUrl.search = querystring.stringify({
         filename: filename,
         cnames: cnames,
     });
     return new Promise((resolve, reject) => {
         const req = http.request(requestUrl, (res) => {
             console.log(`STATUS: ${res.statusCode}`);
             console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
             res.on("data", () => {});
             res.on("end", () => {
                 resolve(res);
             });
         });
         req.on("error", (err) => {
             console.error("http error ", err);
             reject(err);
         });
         req.end();
     });
 }
 
 control_app.listen(PORT, HOST, async (err) => {
     if (err) throw err;
     await loadCnameMap();
     console.log(`Control App listening at http://${HOST}:${PORT}`);
 });