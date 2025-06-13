// {fact rule=unsafe_serialize_javascript_js_rule@v1.0 defects=1}

const express = require("express");
const app = express();
const serialize = require('serialize-javascript');
const escape = require('escape-html');


function non_conformant1() {
    app.get("/query", (req, res) => {
    var userInput = req.params.userinput;

    const result = serialize({foo: userInput}, {unsafe: true, space: 2})
    return result
})}
// {/fact}

// {fact rule=unsafe_serialize_javascript_js_rule@v1.0 defects=0}

function conformant3() {
    app.get("/query", (req, res) => {
    data = escape(req.body)

    const result = serialize({foo: data}, {space: 2})
    return result
})}