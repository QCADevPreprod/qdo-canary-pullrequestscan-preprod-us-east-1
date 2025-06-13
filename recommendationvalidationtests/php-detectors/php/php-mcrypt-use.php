<?php

// ruleid: php-mcrypt-use
mcrypt_ecb(MCRYPT_BLOWFISH, $key, base64_decode($input), MCRYPT_DECRYPT);

// ruleid: php-mcrypt-use
mcrypt_create_iv($iv_size, MCRYPT_RAND);

// ruleid: php-mcrypt-use
mdecrypt_generic($td, $c_t);

// ok: php-mcrypt-use
sodium_crypto_secretbox("Hello World!", $nonce, $key);

// ok: php-mcrypt-use
openssl_encrypt($plaintext, $cipher, $key, $options=0, $iv, $tag);
