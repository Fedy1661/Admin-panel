<?php
require_once('./checkPermission.php');
$_POST = json_decode(file_get_contents("php://input"), true);
$pathToBackups = '../backups/backups.json';
$newName = $_POST['newName'];
$fileName = $_POST['fileName'];
$backups = json_decode(file_get_contents($pathToBackups));
foreach ($backups as $key => $value) {
  if ($value->file === $fileName) {
    $backups[$key]->name = $newName;
    break;
  }
}
echo json_encode($backups);
file_put_contents($pathToBackups, json_encode($backups));
