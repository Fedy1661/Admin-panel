<?php
require_once('./checkPermission.php');
$_POST = json_decode(file_get_contents("php://input"), true);
$file =  $_POST['pageName'];
$HTML = $_POST['html'];
$date = $_POST['date'];
$title = $_POST['title'];
$timestamp = $_POST['timestamp'];

if (!is_dir('../backups/')) {
  mkdir('../backups/');
}
$backups = json_decode(file_get_contents('../backups/backups.json'));
if (!is_array($backups)) {
  $backups = [];
}
$backupFN = $timestamp . '.html';
file_put_contents('../backups/' . $backupFN, $HTML);
array_push($backups, ['page' => $file, 'file' => $backupFN, 'date' => $date, 'name' => $title]);
file_put_contents('../backups/backups.json', json_encode($backups));
