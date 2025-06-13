// {fact rule=path-traversal@v1.0 defects=1}

const fs = require('fs');
const express = require("express")

const app = express();

function non_conformant1(){
    app.post("/remove_content", function(req, res) {

        const path = "application_dir/" + req.params.file_name_to_remove;

        // Non-Conformant: path has tainted data
        fs.unlink(path, function(req, res) {
            res.send("DONE");
        });

    });
}
// {/fact}

// {fact rule=path-traversal@v1.0 defects=0}

function conformant1(){

    app.post("/remove_file", function(req, res) {

        const path = "application_dir/" + req.params.file_name_to_remove;

        // Conformant since we are valiating the data.
        if ( !path.contains("..") ) {
            fs.unlinkSync(path);
        }

        res.send("COMPLETED");
    });
}
// {/fact}

