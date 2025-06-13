// {fact rule=express_vm2_code_injection_js_rule@v1.0 defects=1}

const fs = require('fs');
const {VM, NodeVM} = require('vm2');
const express = require('express');
const app = express();
const port = 3000;
var sanitizer = require('sanitize');


function non_conformant_1() {
    app.get("/abc", (req, res) => {
        code = `console.log(${req.query.input})`;
        const sandbox = {
            setTimeout,
            fs: {
                watch: fs.watch
            }
        };

        new VM({
            timeout: 40 * 1000,
            sandbox
        }).run(code);

        res.send('hello world');
    });
}
// {/fact}

// {fact rule=express_vm2_code_injection_js_rule@v1.0 defects=0}

function conformant_1() {
    app.get('/www', async function okTest1() {
        code = `
    console.log(${req.query.input})
  `;

        const sandbox = {
            setTimeout,
            fs
        };

        return new VM({timeout: 40 * 1000, sandbox}).run(sanitizer(code));
    });
}

// {/fact}