<?php
/**
 * Created by PhpStorm.
 * User: Guillaume
 * Date: 03/04/14
 * Time: 22:00
 */
if ( isset($_POST["imageDataURL"]) && !empty($_POST["imageDataURL"]) && isset($_POST['nameID']) ) {
    // create $dataURL
    $path = 'data/project_'.$_GET['w'].'_'.$_GET['u'].'/';
    if(!is_dir($path)){
        mkdir($path);
    }

    $img = $_POST['imageDataURL'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $path . 'title'.$_POST['nameID'] . '.png';
    $success = file_put_contents($file, $data);
    print $success ? $file : 'Unable to save the file.';
}
else
{
    echo 'Fail';
}