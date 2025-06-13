<?php

function nonCompliant1($value) {
    // ruleid: php-weak-crypto
    $pass = md5($value);
    $user->setPassword($pass);
}

function nonCompliant2($value) {
    // ruleid: php-weak-crypto
    $pass = hash('md5', $value);
    $user->setPassword($pass);
}

function nonCompliant3(){
    // ruleid: php-weak-crypto
    $hashed_password = crypt('mypassword');

    // ruleid: php-weak-crypto
    $hashed_password = md5('mypassword');

    // ruleid: php-weak-crypto
    $hashed_password = md5_file('filename.txt');

    // ruleid: php-weak-crypto
    $hashed_password = sha1('mypassword');

    // ruleid: php-weak-crypto
    $hashed_password = sha1_file('filename.txt');

    // ruleid: php-weak-crypto
    $hashed_password = str_rot13('totally secure');
}

function compliant1($value) {
    // ok: php-weak-crypto
    $pass = hash('sha256', $value);
    $user->setPassword($pass);
}

function compliant2(){
    // ok: php-weak-crypto
    $hashed_password = sodium_crypto_generichash('mypassword');
}