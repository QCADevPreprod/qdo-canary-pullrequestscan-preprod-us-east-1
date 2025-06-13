<?php

$data = $_GET["data"];
// ruleid: php-unserialize-use
$object = unserialize($data);

$data = $_POST["data"];
// ruleid: php-unserialize-use
$object = unserialize($data);

// ok: php-unserialize-use
$object2 = unserialize('O:1:"a":1:{s:5:"value";s:3:"100";}');