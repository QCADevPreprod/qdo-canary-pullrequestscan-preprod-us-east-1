<?php

use PHPMaler\PHPMailer\PHPMailer;

$mail1 = new PHPMailer(true);
// ruleid: php-phpmailer-smtp-insecure
$mail1->Host = 'test.com';
$mail1->SMTPSecure = ''; 

// ruleid: php-phpmailer-smtp-insecure
$mail2 = new PHPMailer(true); 
$mail2->Host = 'test.com';

$mail3 = new PHPMailer(true);
// ok: php-phpmailer-smtp-insecure
$mail3->Host = 'ssl://test.com'; 

$mail4 = new PHPMailer(true);
// ok: php-phpmailer-smtp-insecure
$mail4->Host = 'tls://test.com'; 

$mail5 = new PHPMailer(true);
// ok: php-phpmailer-smtp-insecure
$mail5->Host = 'tls://test.com'; 
$mail5->SMTPSecure = '';

$mail6 = new PHPMailer(true);
// ok: php-phpmailer-smtp-insecure
$mail6->Host = 'test.com';
$mail6->SMTPSecure = 'tls'; 

$mail7 = new PHPMailer(true);
// ok: php-phpmailer-smtp-insecure
$mail7->Host = 'test.com';
$mail7->SMTPSecure = 'ssl';

$mail8 = new PHPMailer(true);
// ok: php-phpmailer-smtp-insecure
$mail8->Host = '127.0.0.1'; 
$mail8->SMTPSecure = '';

$mail9 = new PHPMailer(true);
// ok: php-phpmailer-smtp-insecure
$mail9->Host = 'localhost'; 
$mail9->SMTPSecure = '';

$mail9 = new PHPMailer(); 
// ok: php-phpmailer-smtp-insecure
$mail9->Host = $host;

$mailer = new PHPMailer(); 
$this->host = $host;
// ok: php-phpmailer-smtp-insecure
$mailer->Host = $this->wp->applyFilters('mailpoet_mailer_smtp_host', $this->host);