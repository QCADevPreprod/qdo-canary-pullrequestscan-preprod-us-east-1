// {fact rule=cross-site-scripting@v1.0 defects=1}
var ESAPI = require('node-esapi');

function non_conformant1(){
    document.getElementById("content").innerHTML = "<HTML> Tags and markup";
}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}

function conformant1(){
    document.getElementById("content").innerHTML = ESAPI.encoder().encodeForHTML("<%=untrustedData%>");
}