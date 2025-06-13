<?php

function noncompliant1($input)
{
    $queryBuilder = $conn->createQueryBuilder();

    $queryBuilder
        ->select('id', 'name')
        ->from('users')
        // ruleid: php-doctrine-orm-dangerous-query
        ->where('email = '.$input)
    ;
}

function noncompliant2($email, $input)
{
    $queryBuilder = new QueryBuilder($this->connection);

    $queryBuilder
        ->select('id', 'name')
        ->from('products')
        // ruleid: php-doctrine-orm-dangerous-query
        ->where('code = '.$input)
    ;
}

function noncompliant3($email, $input)
{
    $queryBuilder = new QueryBuilder($this->connection);

    $queryBuilder
        ->select('id', 'name')
        ->from('users')
        ->where('email = ?')
        ->setParameter(0, $email)
        // ruleid: php-doctrine-orm-dangerous-query
        ->andWhere(sprintf('user = %s', $input))
    ;
}

function noncompliant4($email, $input)
{
    $queryBuilder = new QueryBuilder($this->connection);

    $queryBuilder
        ->select('id', 'title')
        ->from('articles')
        // ruleid: php-doctrine-orm-dangerous-query
        ->andWhere(sprintf('author = %s', $input))
    ;
}

function noncompliant5($email, $input)
{
    $name = $_POST['name'];
    $query = $em->createQueryBuilder();
    $query
      ->select('u')
      ->from('User', 'u')
      // ruleid: php-doctrine-orm-dangerous-query
      ->where('u.name = ' . $name)
    ;
}

function compliant1($input)
{
    $queryBuilder = $conn->createQueryBuilder();

    $queryBuilder
        ->select('id', 'name')
        ->from('users')
        // ok: php-doctrine-orm-dangerous-query
        ->where('email = ?')
        ->setParameter(0, $input)
    ;
}

function compliant2($input)
{
    $queryBuilder = $conn->createQueryBuilder();

    $queryBuilder
        ->select('id', 'name')
        ->from('users')
        // ok: php-doctrine-orm-dangerous-query
        ->where('email = :email')
        ->setParameter('email', $input)
    ;
}

function compliant3($input)
{
    $queryBuilder = $conn->createQueryBuilder();

    $queryBuilder
        ->select('id', 'title')
        ->from('posts')
        // ok: php-doctrine-orm-dangerous-query
        ->andWhere('author = ?')
        ->setParameter(0, $input)
    ;
}