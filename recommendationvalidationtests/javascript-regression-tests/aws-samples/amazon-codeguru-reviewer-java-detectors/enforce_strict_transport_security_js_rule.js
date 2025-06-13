// {fact rule=enforce_strict_transport_security@v1.0 defects=1}

const express = require('express');
const helmet = require('helmet');

let app = express();

function non_conformant(){

    app.use(helmet.hsts({
    maxAge: 3153600, 
    includeSubDomains: false 
    }));  // non-conformant

}

// {/fact}

// {fact rule=enforce_strict_transport_security@v1.0 defects=0}

function conformant(){

    app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true
    })); // Conformant

}

// {/fact}

