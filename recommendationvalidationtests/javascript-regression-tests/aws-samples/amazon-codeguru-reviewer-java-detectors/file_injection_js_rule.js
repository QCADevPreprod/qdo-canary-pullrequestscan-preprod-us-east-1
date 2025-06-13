// {fact rule=file_injection_js_rule@v1.0 defects=1}

const fs = require('fs');
const express = require('express');
const app = express();

function non_conformant1(){
    app.get('/student/:mark',(req,res) => {
        var data = req.params.mark;
        fs.writeFile('data.txt', data, function(err){
            if(err) throw err;
            console.log("done");
        });
    })
}
// {/fact}

// {fact rule=file_injection_js_rule@v1.0 defects=0}

function conformant1(){
    const fs = require('fs');
    app.get('/student/:mark',(req,res) => {
        var data = sanitize(req.params.mark);
        fs.writeFile('data.txt', data, function(err){
              if(err) throw err;
              console.log("done");
        });
    })
}