<?php

const BASE_PATH = '/var/www/html/images';

$user_input_compliant_1 = 'file.txt';

$realPath = realpath(BASE_PATH . '/' . $user_input_compliant_1); 
$basePath = dirname($realPath); 
if ($basePath !== BASE_PATH) {
    die('Invalid filename');
}
// ok: php-path-traversal
readfile($basePath);

$user_input_noncompliant_1 = '../../../../etc/password';

$realPath = realpath($user_input_noncompliant_1);
$basePath = dirname($realPath); 
if ($basePath !== BASE_PATH) {
    die('Invalid filename');
}

// ruleid: php-path-traversal
readfile($basePath);
$user_input_compliant_2 = 'subdirectory/file.txt';

$path = BASE_PATH . "/" . $user_input_compliant_2;
if(realpath($path) !== BASE_PATH . $user_input_compliant_2) {
  die("Invalid path");
}
// ok: php-path-traversal
readfile($path); 

$user_input_noncompliant_2 = '../../../../';

// ruleid: php-path-traversal
readfile($user_input_noncompliant_2);

$user_input_compliant_3 = 'subdirectory/../file.txt';

$path = BASE_PATH . "/" . $user_input_compliant_3;
if(realpath($path) !== BASE_PATH . $user_input_compliant_3) {
  die("Invalid path");
}
// ok: php-path-traversal
$json = file_get_contents($path); 

$user_input_noncompliant_3 = '.../...//';

// ruleid: php-path-traversal
$json = file_get_contents($user_input_noncompliant_3);

$user_input_compliant_4 = 'image.png';

$path = BASE_PATH . "/" . $user_input_compliant_4;
if(realpath($path) !== BASE_PATH . $user_input_compliant_4) {
  die("Invalid path");
}
// ok: php-path-traversal
$json = file_get_contents($path); 

$user_input_noncompliant_4 = '.../.../password';

// ruleid: php-path-traversal
$localeFunctions = file($user_input_noncompliant_4, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

?>
