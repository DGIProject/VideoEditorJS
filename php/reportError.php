<?php
/**
 * Created by PhpStorm.
 * User: Dylan
 * Date: 22/03/2015
 * Time: 15:19
 */

include_once 'config.php';

$path = $backPath . $DIR_projectsData . 'error.log';

if($fp = fopen($path, "a"))
{
    fputs($fp, "\n");
    fputs($fp, $_POST['text']);
    fclose($fp);

    echo 'true';
}
else
{
    echo 'error';
}