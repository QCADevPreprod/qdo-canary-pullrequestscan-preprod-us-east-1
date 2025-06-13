// {fact rule=insecure_publicly_writable_directories_js_rule@v1.0 defects=1}

const fs = require('fs');

function non_conformant_1(){

    let tmp_file = "/tmp/f"; // non_conformant

    fs.readFile(tmp_file, 'utf8', function (err, data) {
    // ...
    });

}

// {/fact}

// {fact rule=insecure_publicly_writable_directories_js_rule@v1.0 defects=0}


const tmp = require('tmp');

function conformant_1(){

    const tmp_obj = tmp.fileSync(); // Conformant - Synchronous file creation

    fs.readFileSync(tmp_obj, 'utf8');

}

// {/fact}