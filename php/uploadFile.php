<?php
if ($_GET['w'] != null && $_GET['u'] != null && $_GET['fileID'] != null )
{
    $filename = 'file'.$_GET['fileID'].'.file';
    $path = '../data/project_'.$_GET['w'].'_'.$_GET['u'].'/';

    if(!is_dir($path)){
        mkdir($path);
    }

    $pathTofilename = $path . $filename;

    if (is_uploaded_file($_FILES['multimediaFile']['tmp_name']))
    {
        echo 'success';

        move_uploaded_file ($_FILES['multimediaFile']['tmp_name'], $pathTofilename);
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


