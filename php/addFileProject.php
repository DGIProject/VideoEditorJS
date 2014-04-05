<?php
if($_POST['nameProject'] != NULL && $_POST['contentFile'] != NULL)
{
    $pathToFilename = '../data/listProjects/' . $_POST['nameProject'] . '.vejs';

    $fp = fopen($pathToFilename, "w");
    fputs($fp, $_POST['contentFile']);
    fclose($fp);

    echo 'true';
}
else
{
    echo 'error1';
}


