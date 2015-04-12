<?php

/*
 * This is a short API to allow user to interact with rendered files such as :
 *  - list file rendered
 *  - remove a file
 *  - download a file
 *
 */

include "config.php";

function listFiles($project)
{
    global $DIR_projectsData;
    $path = '../' . $DIR_projectsData . $project . '/RENDER_DATA/';
    $dir = opendir($path);

    $tabListVideoFile = [];
    $i = 0;

    while($file = readdir($dir))
    {
        if($file != '.' && $file != '..' && !is_dir($path . $file))
        {
            if(is_numeric(explode(".",$file)[0]))
            {
                $tabListVideoFile[$i] = $file;
                $i++  ;
            }

        }
    }

    closedir($dir);

    return json_encode($tabListVideoFile);
}

function readVideoFile($project, $id)
{
    global $DIR_projectsData;
    $path = '../' . $DIR_projectsData . $project . '/RENDER_DATA/';
    $file=$id;

    if (($file != "") && (file_exists($path . basename($file))))
    {
        $size = filesize($path . basename($file));
        header("Content-Type: application/force-download; name=\"" . basename($file) . "\"");
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: $size");
        header("Content-Disposition: attachment; filename=\"" . basename($file) . "\"");
        header("Expires: 0");
        header("Cache-Control: no-cache, must-revalidate");
        header("Pragma: no-cache");
        readfile($path . basename($file));
        exit();
    }
}

function deleteFile($project, $id)
{
    global $DIR_projectsData;
    $path = '../' . $DIR_projectsData .$project . '/RENDER_DATA/';
    unlink($path.basename($id));
    unlink($path.basename(explode(".",$id)[0]."_WEB.".explode(".",$id)[1]));
}

switch ($_GET['action'])
{
    case "list":
        echo listFiles($_GET['projectName']);
        break;
    case "read":
        readVideoFile($_GET['projectName'],$_GET['id']);
        break;
    case "delete":
        deleteFile($_GET['projectName'],$_GET['id']);
        break;
    default:
        echo "Missing args";
}