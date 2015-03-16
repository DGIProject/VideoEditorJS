<?php

include "config.php";

if($_POST['nameProject'] != NULL && $_POST['contentFile'] != NULL)
{
    $pathToFilename = "../$DIR_projectsData/".$_POST['nameProject'].".".$_SESSION['user'].".ffm";

    $fp = fopen($pathToFilename, "w");
    fputs($fp, $_POST['contentFile']);
    fclose($fp);


}
else
{
    echo 'error1';
}