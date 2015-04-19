<?php
include_once 'config.php';

if($_GET['projectName'] != NULL && $_GET['fileUId'] != NULL)
{
    $filename = ($_GET['typeFile'] == "RENDER")? $_GET['typeFile'] . '.ffm' : $_GET['typeFile'] . '_' . $_GET['fileUId'] . '.data';

    $path = $backPath . $DIR_projectsData . $_GET['projectName'] . '/';

    if(!is_dir($path))
    {
        mkdir($path);
    }

    $pathToFilename = $path . $filename;

    //echo $pathToFilename;

    if (is_uploaded_file($_FILES['fileData']['tmp_name']))
    {
        echo 'true';

        move_uploaded_file($_FILES['fileData']['tmp_name'], $pathToFilename);
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