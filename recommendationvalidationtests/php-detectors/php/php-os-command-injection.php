<?php

$username = $_COOKIE['username'];
//ruleid: php-os-command-injection
exec("wto -n \"$username\" -g", $ret);

$username = $_COOKIE['username'];
//ruleid: php-os-command-injection
eval("file_contents('path/to/files/$username')");

$jobName = $_REQUEST['jobName'];
$cmd = sprintf("rsyncmd -l \"$xmlPath\" -r %s >/dev/null", $jobName);
//ruleid: php-os-command-injection
system($cmd);

//ruleid: php-os-command-injection
proc_open($jobName);

//ruleid: php-os-command-injection
eval($jobName);

$arg = $_POST['arg'];
$cmd = "logwdweb --post_migration_onboarding -%s %s";
$cmd_logwdweb = "logwdweb --post_migration_onboarding --page %s %s";
$_arg = sprintf("--status %s", $arg);
$cmd = sprintf($cmd_logwdweb, "raidRoaming", $_arg);
//ruleid: php-os-command-injection
pclose(popen($cmd, 'r'));

$fullpath = $_POST['fullpath'];
//ok: php-os-command-injection
$filesize = trim(shell_exec('stat -c %s ' . escapeshellarg($fullpath)));

$errorCode = escapeshellarg($_POST['errorCode']);
$func = escapeshellarg($_POST['func']);
$uuid = str_replace(PHP_EOL, '', file_get_contents("/proc/sys/kernel/random/uuid"));
$logsCmd = sprintf('%s%s%s',
  "wdlog -l INFO -s 'adminUI' -m 'firmware_upload_page' function:string=$func ",
  "status:string='updateFail' errorCode:string=$errorCode ",
  "corid:string='AUI:$uuid' >/dev/null 2>&1"
);
//ok: php-os-command-injection
exec($logsCmd);

//ok: php-os-command-injection
eval('echo "OK"');

//ok: php-os-command-injection
some_other_safe_function($args);

// ok: php-os-command-injection
exec('whoami');

?>