<?php

include "config.php";

if($_POST['nameProject'] != NULL && $_POST['contentFile'] != NULL)
{
    $pathToFilename = "../$DIR_ffmpegCmdFiles/".$_POST['nameProject'].".".$_SESSION['user'].".ffm";

    $fp = fopen($pathToFilename, "w");
    fputs($fp, $_POST['contentFile']);
    fclose($fp);

  /*  $file = "$DIR_Sample/black.png";
    $newfile = $pathToFilename = "../$DIR_ffmpegCmdFiles/black.png";

    if (!copy($file, $newfile)) {
        echo "False";
    }else
    {
        echo 'true';
    }*/



}
else
{
    echo 'error1';
}