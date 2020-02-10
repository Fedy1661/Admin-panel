<?php
session_start();

if ($_SESSION['auth']) {
  session_destroy();
}
