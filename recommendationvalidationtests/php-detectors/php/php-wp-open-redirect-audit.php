<?php

function noncompliant1($url)
{
// ruleid: php-wp-open-redirect-audit
wp_redirect( $url);
exit;
}

function noncompliant2()
{
$url = $_GET['url'];
// ruleid: php-wp-open-redirect-audit
wp_redirect( $url );
exit;
}

function compliant1()
{
// ok: php-wp-open-redirect-audit
wp_safe_redirect($url); 
exit;
}

function compliant1()
{
if( isset( $_POST['location'] ) ){
// ok: php-wp-open-redirect-audit
	wp_safe_redirect($_POST['location']);
	exit;
}
}

?>
