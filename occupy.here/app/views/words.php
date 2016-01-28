<?php

$query = $grid->db->query("
  SELECT content
  FROM message
  ORDER BY updated DESC
  LIMIT 200
");

echo '<table cellspacing="0" cellpadding="0" border="0" id="words">';
echo "\n<tr><th>Word</th><th>L</th><th>C</th><th>V</th></tr>";
while ($message = $query->fetch(PDO::FETCH_OBJ)) {
  $words = preg_split('#\b#', $message->content);
  $new_message = ' class="message"';
  foreach ($words as $word) {
    $word = strtolower($word);
    if (!preg_match('#^[a-z]+$#', $word)) {
      continue;
    }
    $length = strlen($word);
    $disemvoweled = preg_replace('#[aeiou]#', '', $word);
    $consonants = strlen($disemvoweled);
    $vowels = $length - $consonants;
    echo "\n<tr$new_message><td class=\"word\">$word</td><td>$length</td><td>$consonants</td><td>$vowels</td></tr>";
    $new_message = '';
  }
}
echo "\n</table>\n";
echo <<<END
<style>
#words {
  margin-top: 10px;
}

#words th {
  font-weight: bold;
  padding: 5px 10px;
}

#words td {
  padding: 5px 10px;
  border: 1px solid #222;
  background: #333;
  text-align: right;
}

#words tr.message td {
  border-top: 1px solid #fff;
}

#words td.word {
  text-align: left;
}
</style>
END;

?>
