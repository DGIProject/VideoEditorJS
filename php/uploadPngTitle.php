<?php

include "config.php";

if(isset($_POST['imageDataURL']) && !empty($_POST['imageDataURL']) && isset($_POST['nameId']))
{
    $path = "../$DIR_projectsData/" . $_SESSION['user'] . '/';

    if(!is_dir($path))
    {
        mkdir($path);
    }

    $path = "../$DIR_projectsData/" . $_SESSION['user'] . '/'. $_GET['p'] . '/';

    if(!is_dir($path))
    {
        mkdir($path);
    }

    $img = $_POST['imageDataURL']; // Your data 'data:image/png;base64,AAAFBfj42Pj4';
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    file_put_contents($path . 'file'.$_POST['nameId'] . '.file', $data);

    echo 'true';
}
else
{
    echo 'error';
}