<?php
include "config.php";

if($_POST['nameProject'] != NULL && $_POST['contentFile'] != NULL)
{
    $pathToFilename = $backPath . $DIR_projects . $_POST['nameProject'] . '.vejs';

    $fp = fopen($pathToFilename, "w");
    fputs($fp, $_POST['contentFile']);
    fclose($fp);

    echo 'true';
}
else
{
    echo 'error1';
}


