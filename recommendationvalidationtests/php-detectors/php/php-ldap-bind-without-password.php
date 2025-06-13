<?php

$ldapconn = ldap_connect("foo.com");

// ruleid: php-ldap-bind-without-password
$ldapbind = ldap_bind($ldapconn);

// ruleid: php-ldap-bind-without-password
ldap_bind($ldapconn, "username");

// ruleid: php-ldap-bind-without-password
ldap_bind($ldapconn, NULL, NULL);

// ruleid: php-ldap-bind-without-password
ldap_bind($ldapconn, "username", "");

$a = "";
$b = "";
// ruleid: php-ldap-bind-without-password
ldap_bind($ldapconn, $a, $b);

$c = "username";
$d = "";
// ruleid: php-ldap-bind-without-password
ldap_bind($ldapconn, $c, $d);

$e = "user";
$f = "pass";
// ok: php-ldap-bind-without-password
ldap_bind($ldapconn, $e, $f);

// ok: php-ldap-bind-without-password
ldap_bind($ldapconn, "username", "password");

// ok: php-ldap-bind-without-password
ldap_bind($ldapconn, $username, $password);