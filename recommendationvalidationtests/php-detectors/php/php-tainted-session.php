<?php

// ruleid: php-tainted-session
$_SESSION[$_POST['input']] = true;

$inputA = $_POST['input'];
// ruleid: php-tainted-session
$_SESSION[$inputA] = true;

// ok: php-tainted-session
$_SESSION['prefix' . $_POST['input']] = true;

// ok: php-tainted-session
$_SESSION['prefix'][$_POST['input']] = true;

// ok: php-tainted-session
$_SESSION['key'] = $_POST['input'];

$inputB = $_POST['input'];
$inputB = md5($inputB);
// ok: php-tainted-session
$_SESSION[$inputB] = true;

$inputC = $_POST['input'];
$inputC = trim($inputC);
// ruleid: php-tainted-session
$_SESSION[$inputC] = true;

?>