<?php

include "config.php";

if($_POST['nameProject'] != NULL && $_POST['contentFile'] != NULL)
{
    $pathToFilename = "../$DIR_ffmpegCmdFiles/".$_POST['nameProject'].".ffm";

    $fp = fopen($pathToFilename, "w");
    fputs($fp, $_POST['contentFile']);
    fclose($fp);

    echo 'true';
}
else
{
    echo 'error1';
}