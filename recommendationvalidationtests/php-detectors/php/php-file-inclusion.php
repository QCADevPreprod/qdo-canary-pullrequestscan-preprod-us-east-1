<?php

$user_input = $_GET["tainted"];

// ruleid: php-file-inclusion
include($user_input);

// ok: php-file-inclusion
include('constant.php');

// ruleid: php-file-inclusion
include_once($user_input);

// ok: php-file-inclusion
include_once('constant.php');

// ruleid: php-file-inclusion
require($user_input);

// ok: php-file-inclusion
require('constant.php');

// ruleid: php-file-inclusion
require_once($user_input);

// ok: php-file-inclusion
require_once('constant.php');

// ruleid: php-file-inclusion
include(__DIR__ . $user_input);

// ok: php-file-inclusion
include(__DIR__ . 'constant.php');

// ok: php-file-inclusion
include_safe(__DIR__ . $user_input);

// ok: php-file-inclusion
basename(__DIR__ . $user_input);

// ok: php-file-inclusion
require_once(CONFIG_DIR . '/constant.php');

// ok: php-file-inclusion
require_once( dirname( __FILE__ ) . '/admin.php' );

// ok: php-file-inclusion
$pth = 'foo/bar.php';
require_once $pth;
