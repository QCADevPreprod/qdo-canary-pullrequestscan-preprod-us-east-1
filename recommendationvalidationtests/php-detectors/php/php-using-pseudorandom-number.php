<?php

// ruleid: php-using-pseudorandom-number
$insecurerandomNumber = rand();

// ruleid: php-using-pseudorandom-number
$insecurerandomNumber = mt_rand();

// ruleid: php-using-pseudorandom-number
$insecurerandomNumber = uniqid();

// ok: php-using-pseudorandom-number
$secureRandomNumber = random_bytes(16);

// ok: php-using-pseudorandom-number
$secureRandomNumber = openssl_randomm_pseudo_bytes(16);

// ok: php-using-pseudorandom-number
$secureRandomNumber = random_init(1,100);

?>
