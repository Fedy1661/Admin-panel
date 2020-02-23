<?php
session_start();
$_POST = json_decode(file_get_contents('php://input'), true);

$password = $_POST['password'];

if ($password) {
  $settings = json_decode(file_get_contents('./settings.json'), true);
  if ($password === $settings['password']) {
    preg_match('/([\d]+.[\d]+).[\d]+.[\d]+/', $_SERVER['REMOTE_ADDR'], $IP);
    $_SESSION['auth'] = true;
    $_SESSION['IP'] = $IP[1];
    echo json_encode(['auth' => true]);
  } else {
    echo json_encode(['auth' => false]);
  }
} else {
  header('HTTP/1.0 400 Bad Request');
}
