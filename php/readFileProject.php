<?php
include "config.php";

$path = '../' . $DIR_projectsData . $_POST['fileName'];

if (!$fp = fopen($path, "r"))
{
    echo 'error';
}
else
{
    $contentFile = NULL;

    while(!feof($fp))
    {
        $line = fgets($fp,255);

        $contentFile .= $line;
    }

    fclose($fp);

    echo $contentFile;
}