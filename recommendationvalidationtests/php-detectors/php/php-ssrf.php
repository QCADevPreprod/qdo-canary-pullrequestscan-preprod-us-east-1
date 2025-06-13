<?php

    function test1(){
 	    //ruleid: php-ssrf
        $ch = curl_init($_GET['r']);
    }

    function test2(){ 
	    $url = $_GET['r'];
		//ruleid: php-ssrf
        $ch = curl_init($url);
    }

    function test3(){
        $ch = curl_init();
        //ruleid: php-ssrf
        curl_setopt($ch, CURLOPT_URL, $_POST['image_url']);
    }

    function test4(){
        $ch = curl_init();
		 $url = $_GET['r'];
        //ruleid: php-ssrf
        curl_setopt($ch, CURLOPT_URL, $url);
    }

    function test5(){
        $url = $_GET['r'];
		 //ruleid: php-ssrf
        $file = fopen($url, 'rb');
    }

    function test6(){
        //ruleid: php-ssrf
        $file = fopen($_POST['r'], 'rb');
    }

    function test7(){
        $url = $_POST['r'];
        //ruleid: php-ssrf
        $file = file_get_contents($url);
    }

    function test8(){
        //ruleid: php-ssrf
        $file = file_get_contents($_POST['r']);
    }

    function test9(){
        //ok: php-ssrf
        $file = file_get_contents("index.php");
    }

    function test10(){
        //ok: php-ssrf
        $file = fopen("/tmp/test.txt", 'rb');
    }
?>
