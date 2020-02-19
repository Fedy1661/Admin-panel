<?php
require_once('./checkPermission.php');
$pathToBackup = '../backups/backups.json';
if (!is_dir('../backups/')) {
  mkdir('../backups/');
}
if (is_file($pathToBackup)) {
  $backups = json_decode(file_get_contents($pathToBackup));
} else {
  $backups = [];
  file_put_contents($pathToBackup, json_encode($backups));
}
echo json_encode($backups);
