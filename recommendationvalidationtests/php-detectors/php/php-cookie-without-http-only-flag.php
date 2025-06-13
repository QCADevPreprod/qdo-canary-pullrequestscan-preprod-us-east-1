<?php

// ruleid: php-cookie-without-http-only-flag
session.cookie_httponly = 0;

// ruleid: php-cookie-without-http-only-flag
session_set_cookie_params($lifetime, $path, $domain, true, false);

$value = "sensitive data";
// ruleid: php-cookie-without-http-only-flag
setcookie($name, $value, $expire, $path, $domain, true, false);

$value = "sensitive data";
// ruleid: php-cookie-without-http-only-flag
setcookie($name, $value, $expire, $path, $domain, true);

// ruleid: php-cookie-without-http-only-flag
setrawcookie($name, $value, $expire, $path, $domain, true);

// ok: php-cookie-without-http-only-flag
session.cookie_httponly = 1;

// ok: php-cookie-without-http-only-flag
session_set_cookie_params($lifetime, $path, $domain, true, true);

$value = "sensitive data";
// ok: php-cookie-without-http-only-flag
setcookie($name, $value, $expire, $path, $domain, true, true);

// ok: php-cookie-without-http-only-flag
setrawcookie($name, $value, $expire, $path, $domain, true, true);
?>
