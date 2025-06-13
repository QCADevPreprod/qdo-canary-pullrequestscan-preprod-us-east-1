<?php

$parts = explode("/", $_SERVER['PATH_INFO']);
$controllerName = $parts[0];

// ruleid: php-tainted-object-instantiation
$controller = new $controllerName($parts[1]);

// ruleid: php-tainted-object-instantiation
$controller = new $controllerName($_POST['data']);

// ok: php-tainted-object-instantiation
$controller = new MyController($controllerName);

// ok: php-tainted-object-instantiation
$a = "MyController";
$controller = new $a();
