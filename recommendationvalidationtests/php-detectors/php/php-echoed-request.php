<?php

function nonCompliant1() {
    $name = $_REQUEST['name'];
    // ruleid: php-echoed-request
    print("Hello : $name");
    // ruleid: php-echoed-request
    print("Hello : " . $name);
}

function compliant1() {
    $name = $_REQUEST['name'];
    // ok: php-echoed-request
    print("Hello : " . htmlentities($name));
}

function nonCompliant2() {
    $name = $_REQUEST['name'];
    // ruleid: php-echoed-request
    echo "Hello :".$name;
}

function nonCompliant3() {
    // ruleid: php-echoed-request
    echo "Hello ".$_POST['name']." !";
}

function nonCompliant4() {
    $name = $_GET['name'];
    if (str_contains($name, 'foobar')) {
        // ruleid: php-echoed-request
        echo "Hello :".$name;
    }
}

function nonCompliant5() {
    // ruleid: php-echoed-request
    echo "Hello ".htmlentities($_POST['name'])." !".$_POST['lastname'];
}

function nonCompliant6() {
     // ruleid: php-echoed-request
    echo "Hello ".trim($_POST['name']);
}

function compliant2() {
    // ok: php-echoed-request
    echo "Hello ".htmlentities($_POST['name'])." !";
}

function compliant3() {
    $input = $_GET['name'];
    // ok: php-echoed-request
    echo "Hello ".htmlspecialchars($input)." !";
}

function compliant4() {
    $safevar = "Hello ".htmlentities(trim($_GET['name']));
    // ok: php-echoed-request
    echo $safevar;
}

function compliant5() {
    // ok: php-echoed-request
    echo "Hello ".isset($_POST['name'])." !";
}

function compliant6() {
    $safevar = empty($_GET['name']);
    // ok: php-echoed-request
    echo "Hello $safevar !";
}

function compliant7() {
    $safevar = "Hello ".htmlentities($_GET['name']);
    // ok: php-echoed-request
    echo $safevar;
}

function compliant8() {
    $safevar = "Hello ".htmlspecialchars($_GET['name']);
    // ok: php-echoed-request
    echo $safevar;
}
