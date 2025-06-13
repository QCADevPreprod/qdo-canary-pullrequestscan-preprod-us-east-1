const express = require('express')
const app = express()

// {fact rule=express_data_exfilteration_js_rule@v1.0 defects=1}
function nonCompliant1() {
    app.get("nonCompliant1", (req, res) => {
        try {
            const targetObject = {};
            let data = Object.assign(targetObject, req.query);
        }
        catch(err){
            console.log(err)
        }
        return res.end("ok");
    });
}
// {/fact}

// {fact rule=express_data_exfilteration_js_rule@v1.0 defects=0}
function compliant1() {
    try {
        const targetObject = {};
        let data = Object.assign(targetObject, {a : 10});
    }
    catch(err){
        console.log(err)
    }
    res.end("ok");
}
// {/fact}