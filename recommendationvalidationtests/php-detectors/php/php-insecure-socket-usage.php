<?php

function handle_sockets($domain, $type, $protocol, $port, $backlog, $addr, $hostname, $local_socket, $remote_socket, $fd) {
	// ruleid: php-insecure-socket-usage
    socket_create($domain, $type, $protocol); 

	// ruleid: php-insecure-socket-usage
    socket_create_listen($port, $backlog); 

	// ruleid: php-insecure-socket-usage
    socket_addrinfo_bind($addr); 

	// ruleid: php-insecure-socket-usage
    socket_addrinfo_connect($addr); 

	// ruleid: php-insecure-socket-usage
    socket_create_pair($domain, $type, $protocol, $fd);

	// ruleid: php-insecure-socket-usage
    fsockopen($hostname); 

	// ruleid: php-insecure-socket-usage
    pfsockopen($hostname);

	// ruleid: php-insecure-socket-usage
    stream_socket_server($local_socket); 

	// ruleid: php-insecure-socket-usage
    stream_socket_client($remote_socket); 

	// ruleid: php-insecure-socket-usage
    stream_socket_pair($domain, $type, $protocol); 
}

// ruleid: php-insecure-socket-usage
stream_socket_pair($domain, $type, $protocol);

// ok: php-insecure-socket-usage
$abc->fsockopen($hostname); 