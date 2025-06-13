<?php

class OpenSslTest{
    public static function nonCompliant1($crypt, $ky) {
        $key   = html_entity_decode($ky);
        $iv = "@@@@&&&&####$$$$";

        // ruleid: php-openssl-decrypt-validate
        $data = openssl_decrypt ( $crypt , "AES-128-CBC" , $key, 0, $iv );
        return $data;
    }

    public static function nonCompliant2($crypt, $ky) {
        $key   = html_entity_decode($ky);
        $iv = "@@@@&&&&####$$$$";

        // ruleid: php-openssl-decrypt-validate
        $data = openssl_decrypt ( $crypt , "AES-128-CBC" , $key, 0, $iv );
        if($data == true){
            return "";
        }

        return $data;
    }

    public static function nonCompliant3($crypt, $ky) {
        $key   = html_entity_decode($ky);
        $iv = "@@@@&&&&####$$$$";

        // ruleid: php-openssl-decrypt-validate
        return openssl_decrypt ( $crypt , "AES-128-CBC" , $key, 0, $iv );
    }

    public static function compliant1($crypt, $ky) {
        $key   = html_entity_decode($ky);
        $iv = "@@@@&&&&####$$$$";

        // ok: php-openssl-decrypt-validate
        $data = openssl_decrypt ( $crypt , "AES-128-CBC" , $key, 0, $iv );
        if($data == false){
            return "";
        }

        return $data;
    }

    public static function compliant2($crypt, $ky) {
        $key   = html_entity_decode($ky);
        $iv = "@@@@&&&&####$$$$";

        // ok: php-openssl-decrypt-validate
        $data = openssl_decrypt ( $crypt , "AES-128-CBC" , $key, 0, $iv );
        if(false === $data){
            return "";
        }

        return $data;
    }

    public static function compliant3($crypt, $ky) {
        $key   = html_entity_decode($ky);
        $iv = "@@@@&&&&####$$$$";
    
        // ok: php-openssl-decrypt-validate
        $data = openssl_decrypt ( $crypt , "AES-128-CBC" , $key, 0, $iv );
        assertTrue(false !== $data);

        return $data;
    }
}