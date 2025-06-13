<?php

// ruleid: php-wp-csrf-audit
check_ajax_referer( 'wpforms-admin', 'nonce', false );

// ruleid: php-wp-csrf-audit
check_ajax_referer( 'wpforms-admin', 'nonce', 0 );

// ok: php-wp-csrf-audit
check_ajax_referer( 'wpforms-admin', 'nonce', true );

// ok: php-wp-csrf-audit
check_ajax_referer( 'wpforms-admin', 'nonce' );

?>
