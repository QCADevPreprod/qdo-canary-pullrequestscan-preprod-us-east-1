<?php
return [
    'driver' => env('SESSION_DRIVER', 'file'),

    // ruleid: php-laravel-cookie-long-timeout
    'lifetime' => 40,
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],
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

    // ok: php-laravel-cookie-long-timeout
    'lifetime' => env('SESSION_LIFETIME', 120),

    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],
    'cookie' => env(
        'SESSION_COOKIE',
        str_slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),
    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),
    'secure' => env('SESSION_SECURE_COOKIE', false),
    'same_site' => null,
];

return [
    'driver' => env('SESSION_DRIVER', 'file'),

    // ok: php-laravel-cookie-long-timeout
    'lifetime' => 20,

    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],
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

session_set_cookie_params([
       // ok: php-laravel-cookie-long-timeout
        'lifetime' => 20,
        'path' => '/',
        'domain' => $domain,
        'secure' => $secure,
        'httponly' => $httponly,
        'samesite' => $samesite
    ]);
    return [
    
    'system' => [
        'tab'               => 'Systém',
        'session' => [
          // ruleid: php-laravel-cookie-long-timeout
            'lifetime'      => 40,
            'handler'       => 'Správca sedenia',
            'file'          => 'Súbor',
            'database'      => 'Databáza',
        ],
        'file_size'         => 'Max veľkosť (MB)',
        'file_types'        => 'Povolené typy súborov',
    ],
];
  function getIlluminateConfig(): ConfigRepository
    {
        return new ConfigRepository([
            'session' => [
              // ruleid: php-laravel-cookie-long-timeout
                'lifetime' => 120,
                'files' => $this->paths->storage.'/sessions',
                'cookie' => 'session'
            ],
            'view' => [
                'paths' => [],
            ],
        ]);
    }
$params = array_merge([
      // ruleid: php-laravel-cookie-long-timeout
      'lifetime' => 604800,
      'slicesize' => 50
  ], array_filter($params)); 

?>
