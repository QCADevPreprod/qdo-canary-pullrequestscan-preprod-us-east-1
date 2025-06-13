<?php
    // ruleid: php-laravel-active-debug-code 
    config(['app.debug' => 'true']);

    // ruleid: php-laravel-active-debug-code 
    putenv("APP_DEBUG=true");

    // ruleid: php-laravel-active-debug-code 
    $_ENV['APP_DEBUG'] = 'true';

    // ok: php-laravel-active-debug-code
    config(['app.debug' => 'false']);

    // ok: php-laravel-active-debug-code
    putenv("APP_DEBUG=false");

    // ok: php-laravel-active-debug-code 
    $_ENV['APP_DEBUG'] = 'false';

    // ok: php-laravel-active-debug-code
    $value = config('app.debug', 'true');
?>
