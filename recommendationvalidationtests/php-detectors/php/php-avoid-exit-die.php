<?php

function nonCompliant1($param)  {
    if ($param === 42) {
        // ruleid: php-avoid-exit-die
        exit(23);
    }
}

function nonCompliant2($param)  {
    if ($param === 42) {
        // ruleid: php-avoid-exit-die
        die(23);
    }
}

function compliant1($param)  {
    if ($param == 42) {
      // ok: php-avoid-exit-die
      throw new Exception('Value 42 is not expected.');
    }
}

function compliant2($param)  {
    if ($param !== 42 && $param > 0) {
      // ok: php-avoid-exit-die
      print('Valid input');
    }
}

?>