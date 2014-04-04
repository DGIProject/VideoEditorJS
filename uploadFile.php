<?php
/**
 * Created by PhpStorm.
 * User: Guillaume
 * Date: 03/04/14
 * Time: 22:00
 */

if ($_GET['w'] != null && $_GET['u'] != null && $_GET['fileID'] != null )
{
    $filename = 'file'.$_GET['fileID'].'.file';
    $path = 'data/project_'.$_GET['w'].'_'.$_GET['u'].'/';
    if(!is_dir($path)){
        mkdir($path);
    }
    $pathTofilename = $path.$filename;
    //echo $pathTofilename;

    if (is_uploaded_file($_FILES['uf']['tmp_name']))
    {
        echo 'success';
        move_uploaded_file ($_FILES['uf'] ['tmp_name'],
            $pathTofilename);
    }
    else
    {
        echo "faild1";
    }
}
else
{
    echo 'faild';
    exit();
}


