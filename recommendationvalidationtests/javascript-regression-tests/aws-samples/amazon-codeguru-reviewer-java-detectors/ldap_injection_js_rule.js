const ldap = require('ldapjs');
const client = ldap.createClient({
    url: 'ldap://127.0.0.1:1389'
});
const app = require('express');
const router = app.Router();

// {fact rule=ldap-injection@v1.0 defects=1}

function non_conformant1(){
    app.post("/query", (req, res) => {
        let q = url.parse(req.query.url, true);
        let username = q.query.username;
        client.search('o=example', { filter: `(|(name=${username})(username=${username}))` }, function (err, res) {
        });
    });
}


// {/fact}

// {fact rule=ldap-injection@v1.0 defects=0}

function conformant1(){
    app.post("/query", (req, res) => {
        let q = url.parse(req.query.url, true);
        let username = sanitizeInput(q.query.username);
        client.search('o=example', { filter: `(|(name=${username})(username=${username}))` }, function (err, res) {
        });
    });
}