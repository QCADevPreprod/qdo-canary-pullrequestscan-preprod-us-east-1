<?php

return [
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],

    // ok: php-laravel-cookie-secure-set
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),
    'secure' => env('SESSION_SECURE_COOKIE', false),
    'http_only' => true,
    'same_site' => null,

];

return [
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],

    // ruleid: php-laravel-cookie-secure-set
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),
    'secure' => false,
    'http_only' => true,
    'same_site' => null,

];

return [
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],

    // ok: php-laravel-cookie-secure-set
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),
    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),
    'secure' => true,
    'http_only' => true,
    'same_site' => null,

];

return [
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],

    // ruleid: php-laravel-cookie-secure-set
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),
    'http_only' => true,
    'same_site' => null,

];

// ruleid: php-laravel-cookie-secure-set
session_set_cookie_params($lifetime, $path, $domain, false, $httponly);

$value = "sensitive data";
// ruleid: php-laravel-cookie-secure-set
setcookie($name, $value, $expire, $path, $domain, false, false);

$value = "sensitive data";
// ruleid: php-laravel-cookie-secure-set
setcookie($name, $value, $expire, $path, $domain, false);

// ruleid: php-laravel-cookie-secure-set
setrawcookie($name, $value, $expire, $path, $domain, false);

// ok: php-laravel-cookie-secure-set
session_set_cookie_params($lifetime, $path, $domain, true, true);

$value = "sensitive data";
// ok: php-laravel-cookie-secure-set
setcookie($name, $value, $expire, $path, $domain, true, true);

// ok: php-laravel-cookie-secure-set
setrawcookie($name, $value, $expire, $path, $domain, true, true);

$name = "test_cookie";
$value = "test_value";
$expire = time(); 
$path = "/";
// ruleid: php-laravel-cookie-secure-set
setcookie($name, $value, [
    'expires' => $expire,
    'path' => $path,
    'secure' => false, 
]);
?>