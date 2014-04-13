<?php

include "config.php";

if(isset($_POST['imageDataURL']) && !empty($_POST['imageDataURL']) && isset($_POST['nameId']))
{
    $path = "../$DIR_projectsData/" . $_GET['u'] . '/';

    if(!is_dir($path))
    {
        mkdir($path);
    }

    $path = "../$DIR_projectsData/" . $_GET['u'] . '/'. $_GET['p'] . '/';
    if(!is_dir($path))
    {
        mkdir($path);
    }

    $img = $_POST['imageDataURL'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $path . 'title'.$_POST['nameId'] . '.png';
    $success = file_put_contents($file, $data);

    print $success ? $file : 'Unable to save the file.';
}
else
{
    echo 'error1';
}