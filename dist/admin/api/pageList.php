<?php
require_once('./checkPermission.php');
$htmlfiles = glob('../../**/*.html');
$htmlfiles = array_merge($htmlfiles, glob('../../*.html'));
$response = [];
foreach ($htmlfiles as $file) {
  if (!strpos(dirname($file), 'admin')) {
    array_push($response, $file);
  }
}
echo json_encode($response);
