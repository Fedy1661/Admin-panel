<?php
require_once('./checkPermission.php');
$_POST = json_decode(file_get_contents("php://input"), true);

$fileName = $_POST['fileName'];
$pathToBackups = '../backups/backups.json';
$backups = json_decode(file_get_contents($pathToBackups));
$lengthBackups = count($backups);
$newBackups = [];
foreach ($backups as $value) {
  if ($value->file !== $fileName) {
    array_push($newBackups, $value);
  }
}
if (count($newBackups) !== count($backups)) {
  echo json_encode($newBackups);
  file_put_contents($pathToBackups, json_encode($newBackups));
} else {
  header("HTTP/1.0 404 Not Found");
}
