<?php
/**
 * Created by PhpStorm.
 * User: Guillaume
 * Date: 23/06/14
 * Time: 22:27
 */

include_once "config.php";

$remoteImage = "../$DIR_projectsData/" .$_SESSION['user']. '/' . $_GET['p'] . '/file'.$_GET['fileId'].'.file';
$imginfo = filesize($remoteImage);
$mime = mime_content_type($remoteImage);
header("Content-type: $mime");
readfile($remoteImage);