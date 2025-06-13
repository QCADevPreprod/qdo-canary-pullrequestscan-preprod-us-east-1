<?php
use Symfony\Component\Filesystem\Filesystem;
use Illuminate\Filesystem\Filesystem;

// ruleid: php-sensitive-file-permission
chmod("foo", 0777);

// ruleid: php-sensitive-file-permission
umask(0);

// ruleid: php-sensitive-file-permission
umask(0750);

$fs = new Filesystem();
// ruleid: php-sensitive-file-permission
$fs->chmod("foo", 0777);

// ok: php-sensitive-file-permission
chmod("foo", 0750);

// ok: php-sensitive-file-permission
umask(0027);

$fs = new Filesystem();
// ok: php-sensitive-file-permission
$fs->chmod("foo", 0750);
?>
