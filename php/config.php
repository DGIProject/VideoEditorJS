<?php
ini_set('display_errors', 'off');
header("Access-Control-Allow-Origin: *");
session_start();

$backPath = '../';
$systemStep = '/';

function createDirectory($dir)
{
    if (!is_dir("../".$dir))
    {
        mkdir("../".$dir, 0777);
    }
}

if(isset($_POST['username']) && $_POST['username'] != 'undefined')
{
    $_SESSION['user'] = $_POST['username'];
}

$DIR_data = 'data' . $systemStep;
$DIR_Projects = $DIR_data . 'projectsData' . $systemStep;
$DIR_projectsData = $DIR_Projects . $_SESSION['user'] . $systemStep;
$DIR_RenderStat = $DIR_data. 'renderStats'.$systemStep;
$DIR_Sample = $DIR_data . 'samples' . $systemStep; // if you want to change the samples place.

// We create directory if they not exist.

createDirectory($DIR_data);
createDirectory($DIR_Projects);
createDirectory($DIR_projectsData);
createDirectory($DIR_RenderStat);

$fileSufix = uniqid();
