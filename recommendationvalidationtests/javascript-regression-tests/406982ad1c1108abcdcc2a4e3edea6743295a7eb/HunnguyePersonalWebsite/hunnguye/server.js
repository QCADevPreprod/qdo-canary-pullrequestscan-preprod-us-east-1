"use strict";

const AppConfig = require("@amzn/app-config");
const compression = require("compression");
const express = require("express");
// const ldap = require("@amzn/ldap");
const log4js = require("log4js");
const midway = require("@amzn/midway");
const path = require("path");

log4js.configure({
    appenders: {
        out: {type: "stdout", layout: {type: "pattern", pattern: "%d %p %h %c: %m"}}
    },
    categories: {
        default: { appenders: ["out"], level: "info"}
    }
});

const logger = log4js.getLogger("main");
logger.level = "info";

const argv = {
    name: process.env.NAME || "HunnguyePersonalWebsite",
    domain: process.env.DOMAIN || "test",
    realm: process.env.REALM || "desktop",
};
logger.info(`starting with arguments ${JSON.stringify(argv)}`);
const appConfig = new AppConfig(argv);

const app = express();

app.use(compression());
app.use("/public", express.static(path.join(__dirname, "public"), {fallthrough: false}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("json spaces", 2);

const cdnPrefix = appConfig.find("cdnPrefix", argv.domain, argv.realm);
if (cdnPrefix) {
    logger.info(`cdnPrefix=${cdnPrefix}`)
}

app.locals.NODE_ENV = process.env.NODE_ENV;
app.locals.PUBLIC_PATH = cdnPrefix;

app.locals.urlfor = function () {
    const manifest = require(path.join(__dirname, "manifest.json"));
    if (!cdnPrefix) {
        return (url) => manifest[url] || url;
    } else {
        return (url) => `${cdnPrefix}${manifest[url] || url}`;
    }
}();

app.use(midway.express());
// app.use(ldap.express());

app.use("/sdc", require("./routes/sdc"));

//Code modified for integration testing
app.get("/", (req, res) => res.render("index", req.app.locals));

// TODO makes the port be configurable either via command-line argument and/or OpConfig
const port = process.env.PORT || 7000;
const host = process.env.HOST || '127.0.0.1';
app.listen(port, host, () => logger.info(`app listening on port ${port} in ${process.env.NODE_ENV || "development?"}!`));