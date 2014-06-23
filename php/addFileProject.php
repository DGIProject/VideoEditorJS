<?php
include "config.php";

if($_POST['nameProject'] != NULL && $_POST['contentFile'] != NULL)
{
    if (!is_dir('../'.$DIR_projects.'/'.$_SESSION['user'].'/'))
    {
        mkdir('../'.$DIR_projects.'/'.$_SESSION['user']);
    }
    $pathToFilename = '../'.$DIR_projects.'/' .$_SESSION['user'].'/'. $_POST['nameProject'] . '.vejs';

    $fp = fopen($pathToFilename, "w");
    fputs($fp, $_POST['contentFile']);
    fclose($fp);

    echo 'true';
}
else
{
    echo 'error1';
}


