const express = require("express");
const http = require("http");
const path = require("path");
const reload = require("reload");
const bodyParser = require("body-parser");
const app = express();
const chalk = require("chalk");

// read in the package.json to find the application name
const packageJson = require("./package.json");
const relativePathUrl = `/${packageJson.name}/*`;

const publicDir = path.join(__dirname, "src");
const port = process.env.PORT || 3000;
const reloadPort = process.env.RELOAD_PORT || 9856;

app.set("port", port);
app.use(bodyParser.json());
app.use(express.static("src"));

// when requesting root serve index.html
app.get("/", function(req, res) {
  res.sendFile(path.join(publicDir, "index.html"));
});
app.get(`/${packageJson.name}/`, function(req, res) {
  res.sendFile(path.join(publicDir, "index.html"));
});
// when requesting any assets that are /appname/* serve them from source directory
app.get(`/${packageJson.name}/*`, function(req, res) {
  res.sendFile(path.join(publicDir, req.params["0"]));
});
// serve relative navbar code from beta harmony
function temp(){
  app.get('/navigation/*', function(req, res) {
    res.redirect("https://beta.console.harmony.a2z.com"+req.params);
  });
}
const server = http.createServer(app);
reload(app, { port: reloadPort });

server.on("error", e => {
  if (e.code === "EADDRINUSE") {
    console.log("\n\n");
    console.log(
      chalk.red(`ERROR: Another process is already using port ${port}.\n`)
    );
    console.log(
      "You can specify an alternate port using the PORT environment variable, like so:\n"
    );
    console.log(`    $ PORT=${port + 1} npm run dev\n`);
    console.log(
      `Alternately, you can close the other program and type 'rs' [Enter] here.`
    );
    process.exit(1);
  }
});

// The reload script starts another server, which they unfortunately don't give you access to.
// The following is the only way to catch "Address already in use" errors thrown from that server.

process.on("uncaughtException", function(err) {
  if (err.errno === "EADDRINUSE") {
    console.log("\n\n");
    console.log(
      chalk.red(
        `ERROR: Another process is already using port ${reloadPort} (used by the hot-reload functionality).\n`
      )
    );
    console.log(
      "This is often caused by having a Harmony dev server running in another Terminal window. You can specify the port used for hot-reloading with the RELOAD_PORT environment variable, like so:\n"
    );
    console.log(`    $ RELOAD_PORT=${reloadPort + 1} npm run dev\n`);

    console.log(
      `If you need to specify both the webserver port and the reload port, use the following:\n`
    );
    console.log(
      `    $ PORT=${port} RELOAD_PORT=${reloadPort + 1} npm run dev\n`
    );

    console.log(
      `Alternately, you can close the other program and type 'rs' [Enter] here.`
    );
    process.exit(1);
  } else {
    console.log(err);
  }
  process.exit(1);
});

server.listen(app.get("port"), function() {
  console.log(`Server Started: http://localhost:${app.get("port")}`);
});