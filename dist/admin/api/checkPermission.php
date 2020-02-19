<?php
session_start();
if (!$_SESSION['auth']) {
  header('HTTP/1.0 403 Forbidden');
  exit;
}
// define('SESSION_BROWSER_SIGN_SECRET',  '@w434253254s9');
// function getBrowserSign()
// {
//   $rawSign = SESSION_BROWSER_SIGN_SECRET;
//   $signParts = array('HTTP_USER_AGENT');
//   foreach ($signParts as $signPart) {

//     $rawSign .= '::' . (isset($_SERVER[$signPart]) ? $_SERVER[$signPart] : 'none');
//   }
//   return (md5($rawSign));
// }

// define('SESSION_BROWSER_SIGN_KEYNAME', 'session.app.browser.sign');

// $currentBrowserSign = getBrowserSign();
// echo $currentBrowserSign;


// if (isset($_SESSION[SESSION_BROWSER_SIGN_KEYNAME])) {
//   // Сравниваем подпись пользователя со значением из сессии
//   if ($currentBrowserSign != $_SESSION[SESSION_BROWSER_SIGN_KEYNAME]) {
//     session_destroy();
//     $_SESSION = array();
//     die('Попытка взлома!');
//   }
// } else {
//   /* Создана новая сессия. Сохраним подпись браузера
//      * для дальнейшей идентификации владельца сессии */
//   $_SESSION[SESSION_BROWSER_SIGN_KEYNAME] = $currentBrowserSign;
// }
