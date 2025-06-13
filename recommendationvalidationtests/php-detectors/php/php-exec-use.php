<?php

// ruleid: php-exec-use
exec($user_input);

// ok: php-exec-use
exec('whoami');

// ruleid: php-exec-use
passthru($user_input);

// ruleid: php-exec-use
$proc = proc_open($cmd, $descriptorspec, $pipes);

// ruleid: php-exec-use
$handle = popen($user_input, "r");

// ruleid: php-exec-use
$output = shell_exec($user_input);

// ruleid: php-exec-use
$output = system($user_input, $retval);

// ruleid: php-exec-use
pcntl_exec($path);
