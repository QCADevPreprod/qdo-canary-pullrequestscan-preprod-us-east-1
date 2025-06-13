<?php
  // ruleid: php-zip-entry-check
  zip_entry_read($zip_entry, zip_entry_filesize($zip_entry)); 

  // ok: php-zip-entry-check
  zip_entry_read($zip_entry, 1024); 
  // ok: php-zip-entry-check
  zip_entry_read($zip_entry); 

  my_zip_function($zip_entry, zip_entry_filesize($zip_entry));
  $function($zip_entry, zip_entry_filesize($zip_entry));

  // ruleid: php-zip-entry-check
  $zip1 = new ZipArchive();
  $zip1->extractTo('.'); 
  
  // ruleid: php-zip-entry-check
  $zip2 = new ZipArchive;
  $zip2->extractTo('.'); 

   // ruleid: php-zip-entry-check
  (new ZipArchive())->extractTo('.'); 

 ?>
