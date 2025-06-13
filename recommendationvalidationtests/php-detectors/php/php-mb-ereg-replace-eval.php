<?php

// ruleid: php-mb-ereg-replace-eval
mb_ereg_replace($pattern, $replacement, $string, $user_input_options);

// ok: php-mb-ereg-replace-eval
mb_ereg_replace($pattern, $replacement, $string, "msr");

// ok: php-mb-ereg-replace-eval
mb_ereg_replace($pattern, $replacement, $string);

// ok: php-mb-ereg-replace-eval
mb_eregi($pattern, $string, "safe-options");

$user = $_GET['pattern'];
// ruleid: php-mb-ereg-replace-eval
mb_ereg($pattern, $string, $user); 

$options = $_SERVER['HTTP_OPTIONS'];
// ruleid: php-mb-ereg-replace-eval 
mb_eregi($pattern, $string, $options);