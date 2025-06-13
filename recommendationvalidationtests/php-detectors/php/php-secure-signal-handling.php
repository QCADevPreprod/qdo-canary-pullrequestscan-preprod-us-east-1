<?php

function nonCompliant1($param)  {
    $targetPid = (int)$_GET["pid"];
    // ruleid: php-secure-signal-handling
    posix_kill($targetPid, 9);
}

function nonCompliant2($param)  {
    $targetPid = (int)$_GET["pid"];
    // ruleid: php-secure-signal-handling
    pcntl_signal($targetPid, 9);
}


function compliant1($param)  {
    $targetPid = (int)$_GET["pid"];
    // ok: php-secure-signal-handling
    if (isValidPid($targetPid)) {
      posix_kill($targetPid, 9);
    }
}

function compliant2($param)  {
    $targetPid = (int)$_GET["pid"];
    // ok: php-secure-signal-handling
    if (isValidPid($targetPid)) {
      pcntl_signal($targetPid, 9);
    }
}
