// {fact rule=https_connection_pool_js_rule@v1.0 defects=1}
function https_connection_pool_non_compliant(){
    var http = require('http');
    //Non-confromant 
    const keepAliveAgent = new http.Agent({ keepAlive: true });
    options.agent = keepAliveAgent;
    http.request(options, onResponseCallback);
}
// {/fact}

// {fact rule=https_connection_pool_js_rule@v1.0 defects=0}
function https_connection_pool_compliant(){
    var https = require('https');
    //Conformant
    const keepAliveAgent = new https.Agent({ keepAlive: true });
    options.agent = keepAliveAgent;
    https.request(options, onResponseCallback);
}