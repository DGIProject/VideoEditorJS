<?php
ini_set('display_errors', 'off');
session_start();

$systemStep = '/';

function createDirectory($dir)
{
    if (!is_dir("../".$dir))
    {
        mkdir("../".$dir.'/', 0777);
    }
}

$DIR_data = 'data';
$DIR_projects = $DIR_data.$systemStep.'projects'  . $systemStep . $_SESSION['user'];
$DIR_projectsData = $DIR_data.$systemStep.'projectsData' . $systemStep . $_SESSION['user'];
$DIR_ffmpegCmdFiles = $DIR_data.$systemStep.'CommandFile';

$DIR_Sample = '../samples'; // if you want to change the samples place.

// We create directory if they not exist.

createDirectory($DIR_ffmpegCmdFiles);
createDirectory($DIR_projectsData);
createDirectory($DIR_projects);
createDirectory($DIR_data);

$fileSufix = uniqid();


