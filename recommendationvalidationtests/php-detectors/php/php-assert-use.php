<?php

$tainted = $_GET['userinput'];

// ruleid: php-assert-use
assert($tainted);

// ok: php-assert-use
assert('2 > 1');

// ok: php-assert-use
assert($tainted > 1);

Route::get('bad', function ($name) {
  // ruleid: php-assert-use
  assert($name);

  // ok: php-assert-use
  assert('2 > 1');

  // ok: php-assert-use
  assert($name > 1);
});
