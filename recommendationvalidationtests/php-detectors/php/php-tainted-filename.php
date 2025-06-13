<?php

$tainted = $_GET["tainted"];
// ruleid: php-tainted-filename
hash_file('sha1', $tainted);

// ruleid: php-tainted-filename
file($tainted);

// ok: php-tainted-filename
hash_file($tainted, 'file.txt');

// ruleid: php-tainted-filename
file(dirname($tainted));

// ok: php-tainted-filename
file(basename($tainted));

// ok: php-tainted-filename
file(realpath($tainted));

?>