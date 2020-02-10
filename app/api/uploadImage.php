<?php
require_once('./checkPermission.php');
$file = $_FILES['image']['tmp_name'];
if (file_exists($file) && is_uploaded_file($file)) {
  $_FILES['image']['type'] === 'image/*';
  $fileExt = explode('/', $_FILES['image']['type'])[1];
  $fileName = uniqid() . '.' . $fileExt;
  if (!is_dir('../../img/')) mkdir('../../img/');
  move_uploaded_file($file, '../../img/' . $fileName);
  echo json_encode(['src' => $fileName]);
}
