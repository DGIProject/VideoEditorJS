<?php
ini_set('display_errors', 'off');
session_start();

$backPath = '../';
$systemStep = '/';

function createDirectory($dir)
{
    if (!is_dir("../".$dir))
    {
        mkdir("../".$dir.'/', 0777);
    }
}

if(isset($_POST['username']) && $_POST['username'] != 'undefined')
{
    $_SESSION['user'] = $_POST['username'];
}

$DIR_data = 'data' . $systemStep;
$DIR_projects =  $DIR_data . 'projects'  . $systemStep . $_SESSION['user'] . $systemStep;
$DIR_projectsData = $DIR_data . 'projectsData' . $systemStep . $_SESSION['user'] . $systemStep;

$DIR_Sample = '../samples'; // if you want to change the samples place.

// We create directory if they not exist.

createDirectory($DIR_projectsData);
createDirectory($DIR_projects);
createDirectory($DIR_data);

$fileSufix = uniqid();


