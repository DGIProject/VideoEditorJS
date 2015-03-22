<?php
/**
 * Created by PhpStorm.
 * User: Dylan
 * Date: 22/03/2015
 * Time: 15:19
 */

include_once 'config.php';

$path = $backPath . $DIR_data . 'error.log';

if($fp = fopen($path, "a"))
{
    fputs($fp, "\n");
    fputs($fp, '-' . date('m/d/Y h:i:s a', time()) . '- ' . $_POST['text']);
    fclose($fp);

    echo 'true';
}
else
{
    echo 'error';
}