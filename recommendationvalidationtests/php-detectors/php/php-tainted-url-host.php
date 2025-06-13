<?php

function make_request($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

function nonCompliant1() {
    // ruleid: php-tainted-url-host
    $url = 'https://'.$_GET['url'].'/foobar';
    $info = make_request($url);
    return $info;
}

function nonCompliant2() {
    $part = $_POST['url'];
    // ruleid: php-tainted-url-host
    $url = "https://$part/foobar";
    $info = make_request($url);
    return $info;
}

function nonCompliant3() {
    // ruleid: php-tainted-url-host
    $url = "https://{$_REQUEST['url']}/foobar";
    $info = make_request($url);
    return $info;
}

function nonCompliant4() {
    // ruleid: php-tainted-url-host
    $url = sprintf('https://%s/%s/', $_COOKIE['foo'], $bar);
    $info = make_request($url);
    return $info;
}


function compliant1() {
    // ok: php-tainted-url-host
    $url = 'https://www.google.com/'.$_GET['url'].'/foobar';
    $info = make_request($url);
    return $info;
}

function compliant2() {
    $part = $_POST['url'];
    // ok: php-tainted-url-host
    $url = "some random text /$part/ foobar";
    $info = make_request($url);
    return $info;
}

function compliant3() {
    // ok: php-tainted-url-host
    $url = "https://www.google.com/{$_REQUEST['url']}/foobar";
    $info = make_request($url);
    return $info;
}

function compliant4() {
    // ok: php-tainted-url-host
    $url = sprintf('some random format string %s %s', $_COOKIE['foo'], $bar);
    $info = make_request($url);
    return $info;
}

?>