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

   /* $img = $_POST['imageDataURL'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $path . 'file'.$_POST['nameId'] . '.file';
    $success = file_put_contents($file, $data);*/

    /*$data = substr($_POST['imageDataURL'], strpos($_POST['imageDataURL'], ",") + 1);
    $decodedData = base64_decode($data);
    $fp = fopen($path . 'file'.$_POST['nameId'] . '.file', 'wb');
    fwrite($fp, $decodedData);
    fclose($fp);*/


    /*$data = $_POST['imageDataURL'];
    list($type, $data) = explode(';', $data);
    list(, $data)      = explode(',', $data);
    $data = base64_decode($data);
*
    file_put_contents($path . 'file'.$_POST['nameId'] . '.file', $data);*/


    $img = $_POST['imageDataURL']; // Your data 'data:image/png;base64,AAAFBfj42Pj4';
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    file_put_contents($path . 'file'.$_POST['nameId'] . '.file', $data);

    echo "ok2";
}
else
{
    echo 'error1';
}