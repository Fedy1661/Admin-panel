<?php
session_start();
if(!$_SESSION['auth']){
  header('HTTP/1.0 403 Forbidden');
  exit;
}