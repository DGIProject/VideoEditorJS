<?php
ini_set('display_errors', 'off');
include "config.php";

if($_GET['p'] != NULL && $_GET['fileId'] != NULL)
{
    if ($_GET['thum'] != 1)
    {
        $filename = 'file'.$_GET['fileId'].'.file';
    }
    else
    {
        $filename = 'thum'.$_GET['fileId'].'.file';
    }
    $path = "../$DIR_projectsData/" .$_SESSION['user']. '/' . $_GET['p'] . '/';

    if(!is_dir($path))
    {
        mkdir("../$DIR_projectsData/". $_SESSION['user'] . '/');
        mkdir($path);
    }

    $pathToFilename = $path . $filename;

    if (is_uploaded_file($_FILES['multimediaFile']['tmp_name']))
    {
        echo 'success';

        move_uploaded_file($_FILES['multimediaFile']['tmp_name'], $pathToFilename);
    }
    else
    {
        echo 'error2';
    }
}
else
{
    echo 'error1';
}


