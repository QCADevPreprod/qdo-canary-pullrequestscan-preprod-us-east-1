<?php

function configure_logging() {
  // ok: php-insecure-logging-config
  error_reporting(E_RECOVERABLE_ERROR);
  
  // ruleid: php-insecure-logging-config
  Error_Reporting(32);

  // ruleid: php-insecure-logging-config
  ini_set('docref_root', '1');
  // ruleid: php-insecure-logging-config
  ini_set('display_errors', '1');
  // ruleid: php-insecure-logging-config
  INI_SET('display_startup_errors', '1');
  // ruleid: php-insecure-logging-config
  ini_set('error_log', "path/to/logfile1");
  // ruleid: php-insecure-logging-config
  ini_set('error_log', "path/to/logfile2");
  // ok: php-insecure-logging-config
  ini_set('error_reporting', E_PARSE );
  // ruleid: php-insecure-logging-config
  ini_set('error_reporting', 64);
  // ruleid: php-insecure-logging-config
  ini_set('log_errors', '0');
  // ruleid: php-insecure-logging-config
  ini_set('log_errors_max_length', '512');
  // ruleid: php-insecure-logging-config
  ini_set('ignore_repeated_errors', '1');
  // ruleid: php-insecure-logging-config
  ini_set('ignore_repeated_source', '1');
  // ruleid: php-insecure-logging-config
  ini_set('track_errors', '0');
  // ruleid: php-insecure-logging-config
  ini_alter('docref_root', 'anythingElse');
  // ruleid: php-insecure-logging-config
  INI_ALTER('display_errors', 'anythingElse');
  // ruleid: php-insecure-logging-config
  ini_alter('display_startup_errors', 'anythingElse');
  // ruleid: php-insecure-logging-config
  ini_alter('error_log', "path/to/logfile1");
  // ruleid: php-insecure-logging-config
  ini_alter('error_log', "path/to/logfile2");
  // ruleid: php-insecure-logging-config
  ini_alter('error_reporting', 1);
  // ruleid: php-insecure-logging-config
  ini_alter('log_errors', '3');
  // ruleid: php-insecure-logging-config
  ini_alter('log_errors_max_length', '2000');
  // ruleid: php-insecure-logging-config
  ini_alter('ignore_repeated_errors', '2');
  // ruleid: php-insecure-logging-config
  ini_alter('ignore_repeated_source', '5');
  // ruleid: php-insecure-logging-config
  ini_alter('track_errors', NULL);

  // ok: php-insecure-logging-config
  ini_set('docref_root', '0');
  // ok: php-insecure-logging-config
  ini_set('display_errors', '0');
  // ok: php-insecure-logging-config
  ini_set('display_startup_errors', '0');
  // ruleid: php-insecure-logging-config
  error_reporting(); 
  // ruleid: php-insecure-logging-config
  error_reporting(0); 
  // ok: php-insecure-logging-config
  error_reporting(E_ALL); 
  // ok: php-insecure-logging-config
  error_reporting(32767); 
  // ruleid: php-insecure-logging-config
  error_reporting(-1); 
  // ruleid: php-insecure-logging-config
  ini_set('error_reporting', 0); 
  // ok: php-insecure-logging-config
  ini_set('error_reporting', E_ALL); 
  // ok: php-insecure-logging-config
  ini_set('error_reporting', 32767); 
  // ruleid: php-insecure-logging-config
  ini_set('error_reporting', -1); 
  
  // ok: php-insecure-logging-config
  ini_set('log_errors', '1');
  // ok: php-insecure-logging-config
  ini_set('log_errors_max_length', '0');
  // ok: php-insecure-logging-config
  ini_set('ignore_repeated_errors', '0');
  // ok: php-insecure-logging-config
  ini_set('ignore_repeated_source', '0');
  // ok: php-insecure-logging-config
  ini_set('track_errors', '1');

  // ruleid: php-insecure-logging-config
  log_errors(2);
  // ruleid: php-insecure-logging-config
  ini_set(NULL, NULL);
  // ruleid: php-insecure-logging-config
  ini_alter["abc"]('track_errors', NULL);
  // ruleid: php-insecure-logging-config
  error_reporting["abc"](32);
  // ruleid: php-insecure-logging-config
  other_methods('log_errors', '3');
  // ruleid: php-insecure-logging-config
  ini_set('track_errors', '0', 'abc'); 
}


function named_arguments() {
  // ruleid: php-insecure-logging-config
  error_reporting(level: E_RECOVERABLE_ERROR);
  // ruleid: php-insecure-logging-config
  ini_set(newvalue:'1', varname: 'docref_root');
  // ruleid: php-insecure-logging-config
  ini_alter(newvalue: '3', varname: 'log_errors'); 
  // ruleid: php-insecure-logging-config
  ini_set(varname: 'log_errors', newvalue: '1');
  
  // ok: php-insecure-logging-config
  ini_set(arg1: 'log_errors', arg2: '1');
  // ruleid: php-insecure-logging-config
  ini_set(arg1: 'log_errors', varname: '1');

}