// {fact rule=insecure-hashing@v1.0 defects=1}

function hash_algo_check_non_conformant1(){
    let crypto=require('crypto')
    const assert = require("assert");
    // Noncompliant: Weak hashing algorithm is used.
    crypto.pbkdf2(getpassword(), salt, iterations, keylen,'md5', function(err, actual) {
        assert.equal(actual.toString('binary'), expected);
    });
}
// {/fact}

// {fact rule=insecure-hashing@v1.0 defects=0}
function hash_algo_check_conformant1(){
    let crypto=require('crypto')
    const assert = require("assert");
    // Compliant: Strong hashing algorithm is used.
    crypto.pbkdf2(getpassword(), salt, iterations, keylen,'sha384', function(err, actual) {
        assert.equal(actual.toString('binary'), expected);
    });
}
// {/fact}