<?php

require_once __DIR__ . '/app/functions.php';

$led = '/sys/class/leds/tp-link:green:wps';
if (file_exists("$led/message")) {
  $modified = filemtime("$led/message");
  if (time() - $modified > 60) {
    blink_leds('');
  }
}

?>
