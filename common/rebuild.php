<?php // юникод utf-8

$output = array();

echo "<pre>\r\n";

function stdout($line)
{
    global $output;

    echo "$line\r\n";
    array_push($output, $line);
}

stdout(date('d.m.Y H:i:s'));

// opening database

stdout('-----------------------');

// git

if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN')
{
    stdout('-----------------------');

    exec('/usr/local/bin/git --version 2>&1', $output);

    stdout('-----------------------');

    exec('/usr/local/bin/git fetch --all && /usr/local/bin/git reset --hard origin/master 2>&1', $output);

    stdout('-----------------------');
}}

// all done

stdout('OK');
stdout('-----------------------');
stdout(date('d.m.Y H:i:s'));

echo "</pre>\r\n<br/>\r\n<a href='http://apps.vurdalakov.net/'>http://apps.vurdalakov.net/</a>\r\n";

// mail

$body = implode("\r\n", $output);

$body .= "\r\n\r\nhttp://apps.vurdalakov.net/";

echo "<pre>\r\n=======================\r\n$body\r\n=======================\r\n</pre>";

if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN')
{
    mail('webmaster@vurdalakov.net', 'POST hook: apps.vurdalakov.net', $body);
}
?>