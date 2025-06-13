<?php

$file = $_GET['file'];
 // ruleid: php-backticks-use
$contents = `cat $file`; 

$dir = $_POST['dir'];
 // ruleid: php-backticks-use
$files = `ls $dir`; 

$domain = $_REQUEST['domain'];
 // ruleid: php-backticks-use
$ping = `ping $domain`; 

$file = 'info.txt'; 
 // ok: php-backticks-use
$contents = `cat $file`; 

$dir = '/home/user/'; 
 // ok: php-backticks-use
$files = `ls $dir`;

$domain = escapeshellarg($domain); 
 // ok: php-backticks-use
$ping = `ping $domain`;
