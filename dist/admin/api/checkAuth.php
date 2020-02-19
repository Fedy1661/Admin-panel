<?php
session_start();
if ($_SESSION['auth']) {
  echo json_encode(['auth' => true]);
} else {
  echo json_encode(['auth' => false]);
}
