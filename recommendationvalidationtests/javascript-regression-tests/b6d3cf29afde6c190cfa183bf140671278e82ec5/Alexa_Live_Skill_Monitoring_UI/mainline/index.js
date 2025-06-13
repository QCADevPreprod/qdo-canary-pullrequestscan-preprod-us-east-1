var express = require('express');
var path = require('path');
var ApolloEnvInfo = require('apollo-env-info');


var app = express();
var apolloEnvInfo = new ApolloEnvInfo();

var pubsub = apolloEnvInfo.getOperationalConfig("PubSub") || {}

var httpServerOpConfig = apolloEnvInfo.getOperationalConfig('HttpServer') || {};


const PORT = process.env.PORT || httpServerOpConfig.httpRegularPort || 8000;

app.use(express.static(path.join(__dirname, '/public')));




app.get('*', function(req, res) {
    var domain = pubsub.domain || "test";
    // console.log(domain)
    res.cookie("body",String(res.query.body));

});



app.listen(PORT, function() {

    // console.log("//apollo",isRunningInApollo,ws.buildDir + '/brazil-config/global/skillDiff.cfg')
    console.log('Server listening on port %s', PORT);
});