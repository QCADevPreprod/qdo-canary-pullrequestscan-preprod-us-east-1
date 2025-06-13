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

    // ok: php-laravel-cookie-null-domain
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),
    'secure' => env('SESSION_SECURE_COOKIE', false),
    'http_only' => false,
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

    // ruleid: php-laravel-cookie-null-domain
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => '/',
    'domain' => "baddomain.com",
    'secure' => env('SESSION_SECURE_COOKIE', false),
    'http_only' => false,
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

    // ruleid: php-laravel-cookie-null-domain
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => '/',
    'secure' => env('SESSION_SECURE_COOKIE', false),
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

    // ok: php-laravel-cookie-null-domain
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => '/',
    'domain' => null, 
    'secure' => env('SESSION_SECURE_COOKIE', false),
    'http_only' => true,
    'same_site' => null,

];
// ruleid: php-laravel-cookie-null-domain
session_set_cookie_params($lifetime, $path, "baddomain.com", $secure, $httponly);

$value = "sensitive data";
// ruleid: php-laravel-cookie-null-domain
setcookie($name, $value, $expire, $path, $domain, false, false);

// ruleid: php-laravel-cookie-null-domain
setcookie($name, $value, $expire, $path, $domain);

$value = "sensitive data";
// ruleid: php-laravel-cookie-null-domain
setcookie($name, $value, $expire, $path, $domain, false);

// ruleid: php-laravel-cookie-null-domain
setrawcookie($name, $value, $expire, $path, $domain, false);

// ok: php-laravel-cookie-null-domain
session_set_cookie_params($lifetime, $path, null, true, true);

$value = "sensitive data";
// ok: php-laravel-cookie-null-domain
setcookie($name, $value, $expire, $path, null, true, true);

// ok: php-laravel-cookie-null-domain
setrawcookie($name, $value, $expire, $path, null, true, true);

$name = "test_cookie";
$value = "test_value";
$expire = time(); 
$path = "/";
// ok: php-laravel-cookie-null-domain
setcookie($name, $value, [
    'expires' => $expire,
    'domain' => null,
    'secure' => true, 
]);

// ruleid: php-laravel-cookie-null-domain
setcookie($name, $value, [
    'expires' => $expire,
    'domain' => "baddomain.com",
    'secure' => true, 
]);

?>