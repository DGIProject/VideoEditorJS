<?php
if(isset($_POST['imageDataURL']) && !empty($_POST['imageDataURL']) && isset($_POST['nameId']))
{
    $path = '../data/' . $_GET['u'] . '/' . $_GET['p'] . '/';

    if(!is_dir($path))
    {
        mkdir('../data/' . $_GET['u'] . '/');
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
    echo 'error1';
}