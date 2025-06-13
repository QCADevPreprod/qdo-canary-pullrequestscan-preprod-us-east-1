<?php
namespace symfony;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Response as FooResponse;

// ruleid: php-symfony-permissive-cors
$response = new Response('content', Response::HTTP_OK, ['Access-Control-Allow-Origin' => '*']);

// ruleid: php-symfony-permissive-cors
$response = new Response('content', Response::HTTP_OK, Array('Access-Control-Allow-Origin' => '*'));

// ruleid: php-symfony-permissive-cors
$response = new FooResponse('content', Response::HTTP_OK, ['Access-Control-Allow-Origin' => '*']);

$headers = ['Access-Control-Allow-Origin' => '*'];
// ruleid: php-symfony-permissive-cors
$response = new Response('content', Response::HTTP_OK, $headers);

// ruleid: php-symfony-permissive-cors
$response->headers->set('  access-control-allow-origin  ', '  *  ');

$safe = ['foo' => 'bar'];
// ok: php-symfony-permissive-cors
$response = new Response('content', Response::HTTP_OK, $safe);

// ok: php-symfony-permissive-cors
$response = new Response('content', Response::HTTP_OK, ['Access-Control-Allow-Origin' => 'https://www.example.com']);

// ok: php-symfony-permissive-cors
$response = new Response('content', Response::HTTP_OK, ['Other-Property' => '*']);

// ok: php-symfony-permissive-cors
$response = new Foo('content', Response::HTTP_OK, ['Access-Control-Allow-Origin' => '*']);

// ok: php-symfony-permissive-cors
$response->headers->set('Access-Control-Allow-Origin', 'foo');

// ok: php-symfony-permissive-cors
$response->headers->set('Other-Property', '*');

?>
