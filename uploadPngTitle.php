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
    $dataURL = $_POST["imageDataURL"];
    // Extract base64 data
    // we have an unneeded header, zap it
    $parts = explode(',', $dataURL);
    $data = $parts[1];
    // Decode
    $data = base64_decode($data);
    // Save
    $fp = fopen($path.'title'.$_POST['nameID'].'.png', 'w');
    fwrite($fp, $data);
    fclose($fp);
}
else
{
    echo 'Fail';
}