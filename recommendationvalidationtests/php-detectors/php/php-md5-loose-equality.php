<?php

// ruleid: php-md5-loose-equality
md5("240610708") == "0";

// ruleid: php-md5-loose-equality
0 == md5("240610708");

// ruleid: php-md5-loose-equality
0 == md5_file("file.txt");

// ruleid: php-md5-loose-equality
md5("240610708") == md5_file("file.txt");

// ok: php-md5-loose-equality
md5("240610708") === "0";