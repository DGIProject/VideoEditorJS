<?php
include_once "config.php";

$path = '../' . $DIR_projectsData . $_GET['projectName'] . '/' . $_GET['fileName'] . '.data';

if(is_file($path))
{
    $imginfo = filesize($path);
    $mime = mime_content_type($path);
    header("Content-type: $mime");
    readfile($path);
}
else
{
    echo 'error';
}