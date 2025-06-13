<?php

$tainted = $_GET['userinput'];

// ruleid: php-laravel-sql-injection
DB::unprepared("update users set votes = 100 where name = '$tainted'");

// ruleid: php-laravel-sql-injection
$user = DB::table('users')->where($tainted, 'John')->first();
// ruleid: php-laravel-sql-injection
$titles = DB::table('users')->pluck($tainted);
// ruleid: php-laravel-sql-injection
DB::table('users')->orderBy($tainted);
// ruleid: php-laravel-sql-injection
$price = DB::table('orders')->max($tainted);
// ruleid: php-laravel-sql-injection
$query = DB::table('users')->select($tainted);

// ok: php-laravel-sql-injection
$user = DB::table('users')->where('name', $tainted)->first();

// ruleid: php-laravel-sql-injection
$users = DB::table('users')->select(DB::raw($tainted));
// ruleid: php-laravel-sql-injection
$orders = DB::table('orders')->selectRaw($tainted);
// ruleid: php-laravel-sql-injection
$orders = DB::table('orders')->whereRaw($tainted);

// ok: php-laravel-sql-injection
$orders = DB::table('orders')->selectRaw('price * ? as price_with_tax', [$tainted]);