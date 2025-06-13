<?php
 
 // ruleid: php-wp-php-object-injection-audit
 $content = unserialize($POST['post_content']);
 
 // ruleid: php-wp-php-object-injection-audit
 $unsafe = unserialize($_GET['data']); 
 
 // ruleid: php-wp-php-object-injection-audit
 $rank_math=unserialize($rank_value);
 
 // ruleid: php-wp-php-object-injection-audit
 $import_options = maybe_unserialize($import->options);
 
 // ruleid: php-wp-php-object-injection-audit
 $data = unserialize(base64_decode($var));
 
 // ok: php-wp-php-object-injection-audit
 $data = serialize(base64_encode($var));
 
 // ok: php-wp-php-object-injection-audit
 $encoded = base64_encode(serialize($var));
 
 // ok: php-wp-php-object-injection-audit
 $object2 = unserialize('O:1:"a":1:{s:5:"value";s:3:"100";}');
 ?>
 