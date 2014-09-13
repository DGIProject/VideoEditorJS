<?php

include "config.php";

if ($_POST['image'] != null)
{
    $path = "../$DIR_projectsData/" . $_SESSION['user'] . '/';

    if(!is_dir($path))
    {
        mkdir($path);
    }

    $path = "../$DIR_projectsData/User/testVideoUpload/";

    if(!is_dir($path))
    {
        mkdir($path);
    }

    $img = $_POST['image']; // Your data 'data:image/png;base64,AAAFBfj42Pj4';
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    file_put_contents($path . 'video'.$_POST['it'].'.png', $data);

    echo 'true';
}
elseif ($_POST['images'] != null)
{
    $i=0;
    $images = json_decode($_POST['images']);
    foreach ($images as $image)
    {
        $path = "../$DIR_projectsData/" .'User' . '/';

        if(!is_dir($path))
        {
            mkdir($path);
        }

        $path = "../$DIR_projectsData/User/testVideoUpload/";

        if(!is_dir($path))
        {
            mkdir($path);
        }

        $img = $image; // Your data 'data:image/png;base64,AAAFBfj42Pj4';
        $img = str_replace('data:image/png;base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $data = base64_decode($img);
        file_put_contents($path . 'video'.$i.'.png', $data);
        $i++;
    }
}



  /*  $path = "../$DIR_projectsData/" . $_SESSION['user'] . '/';

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

    echo 'true';*/

