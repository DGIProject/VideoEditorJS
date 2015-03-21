<?php
include "config.php";

if($_POST['nameProject'] != NULL && $_POST['contentFile'] != NULL)
{
    $pathToFilename = $backPath . $DIR_projectsData . $_POST['nameProject'] . '.vejs';
    $contentFile = $_POST['contentFile'];

    if(is_file($pathToFilename))
    {
        if($_POST['forceSave'] == 'true')
        {
            saveProject($pathToFilename, $contentFile);

            echo 'true';
        }
        else
        {
            echo 'alreadyExist';
        }
    }
    else
    {
        saveProject($pathToFilename, $contentFile);

        echo 'true';
    }
}
else
{
    echo 'error1';
}

function saveProject($path, $contentFile) {
    $fp = fopen($path, "w");
    fputs($fp, $contentFile);
    fclose($fp);
}


