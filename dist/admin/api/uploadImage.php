<?php
require_once('./checkPermission.php');
$path = $_POST['path'];
$file = $_FILES['image']['tmp_name'];
$pathToImg = $path . '/img' . '/';
if (file_exists($file) && is_uploaded_file($file)) {
  $_FILES['image']['type'] === 'image/*';
  $fileExt = explode('/', $_FILES['image']['type'])[1];
  $fileName = $_FILES['image']['name'];
  if (!is_dir($pathToImg)) mkdir($pathToImg);
  if (!is_file($pathToImg . $fileName)) {
    move_uploaded_file($file, $pathToImg  . $fileName);
  };
  echo $fileName;
}
