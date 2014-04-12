<?php
ini_set('display_errors', 'off');

if($_GET['u'] != NULL && $_GET['p'] != NULL && $_GET['fileId'] != NULL)
{
    $filename = 'file'.$_GET['fileId'].'.file';
    $path = '../data/' . $_GET['u'] . '/' . $_GET['p'] . '/';

    if(!is_dir($path))
    {
        mkdir('../data/' . $_GET['u'] . '/');
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


