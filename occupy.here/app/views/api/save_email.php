<?php

if (!empty($params['email'])) {
  $grid->db->insert('email', array(
    'email' => $params['email'],
    'created' => time()
  ));
}

?>
