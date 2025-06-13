<?php

function nonCompliant1() {
    // ruleid: php-tainted-sql-string
    $query = "SELECT * FROM table WHERE Id = '".$_GET['url']."'";
    $info = mysql_query($query);
    return $info;
}

function nonCompliant2() {
    $part = $_POST['url'];
    // ruleid: php-tainted-sql-string
    $query = "SELECT * FROM table WHERE Id = '$part'";
    $info = mysql_query($query);
    return $info;
}

function nonCompliant3() {
    // ruleid: php-tainted-sql-string
    $query = "SELECT * FROM table WHERE Id = '{$_REQUEST['url']}'";
    $info = mysql_query($query);
    return $info;
}

function nonCompliant4() {
    // ruleid: php-tainted-sql-string
    $query = sprintf("SELECT * FROM table WHERE Id = '%s'", $_COOKIE['foo']);
    $info = mysql_query($query);
    return $info;
}

function compliant1() {
    // ok: php-tainted-sql-string
    $query = 'SELECT * FROM table WHERE Id = 1';
    $info = mysql_query($query);
    return $info;
}

function compliant2() {
    $value = 1;
    // ok: php-tainted-sql-string
    $query = "SELECT * FROM table WHERE Id = '".$value."'";
    $info = mysql_query($query);
    return $info;
}

function compliant3() {
    // ok: php-tainted-sql-string
    $query = "SELECT * FROM table WHERE Id = '{$foobar() ? 1 : 2}'";
    $info = mysql_query($query);
    return $info;
}

function compliant4() {
    $value = 1;
    // ok: php-tainted-sql-string
    $query = sprintf("SELECT * FROM table WHERE Id = '%s'", $value);
    $info = mysql_query($query);
    return $info;
}

function compliant5() {
    $part = $_POST['url'];
    $part = mysqli_real_escape_string($part);
    // ok: php-tainted-sql-string
    $query = sprintf("SELECT * FROM table WHERE Id = '" . $part . "'");
    $info = mysql_query($query);
    return $info;
}