<?php
/**
 * Created by PhpStorm.
 * User: Guillaume
 * Date: 18/04/2015
 * Time: 10:25
 */

/*
 * This little API has this roles
 *  - Create project
 *  - Save project
 *  - Delete project
 *  - List project
 *  - Read project
 */

include "config.php";

function readProject($path)
{
    if (file_exists($path))
    {
        echo file_get_contents($path);
    }
    else
    {
        echo json_encode(array("code" => -1, "info" => "couldn't open file"));
    }

}

function saveProject($path, $contentFile) {
    $fp = fopen($path, "w");
    fputs($fp, $contentFile);
    fclose($fp);
}

function listProject()
{
    global $DIR_projectsData, $backPath;
    $dirname = $backPath . $DIR_projectsData;

    $dir = opendir($dirname);

    $tabListProjects = [];
    $i = 0;

    while($file = readdir($dir))
    {
        if($file != '.' && $file != '..' && !is_dir($dirname . $file))
        {
            $tabListProjects[$i] = $file;

            $i++;
        }
    }

    closedir($dir);

    echo json_encode($tabListProjects);
}

function deleteProject($path, $pathToFile) {
    unlink($pathToFile);
    clear($path);

    rmdir($path . 'RENDER_DATA/');
    rmdir($path);

    return json_encode(array('code' => 0));
}

function clear($path)
{
    $dir = opendir($path);
    $i = 0;

    while($file = readdir($dir))
    {
        if($file != '.' && $file != '..' && !is_dir($path . $file))
        {
                unlink($path.$file);
                $i++  ;
        }
    }

    closedir($dir);
}

if (!isset($_POST['nameProject']) && $_GET['action'] != 'list')
{
    echo json_encode(array('code'=> -1, "info" => "There are missing args"));
    exit(0);
}

$projectName = $_POST['nameProject'];
$fileContent = $_POST['contentFile'];



switch ($_GET['action'])
{
    case "read":
        $pathToFile = $backPath . $DIR_projectsData . $projectName;
        readProject($pathToFile);
        break;
    case "list":
        listProject();
        break;
    case "create":
        $path = '../' . $DIR_projectsData . $projectName . '/RENDER_DATA/';
        clear($path);
        $path = '../' . $DIR_projectsData . $projectName . '/';
        clear($path);
        echo json_encode(array("code"=> 0));
        break;
    case "save":
        $pathToFile = $backPath . $DIR_projectsData . $projectName . '.vejs';
        if(is_file($pathToFile))
        {
            if($_POST['forceSave'] == 'true')
            {
                saveProject($pathToFile, $fileContent);
                echo json_encode(array("code"=> 0));
            }
            else
            {
                echo json_encode(array("code"=> 1, "info"=> "The file already exist"));
            }
        }
        else
        {
            saveProject($pathToFile, $fileContent);
            echo json_encode(array("code"=> 0));
        }
        break;
    case "delete":
        $path = '../' . $DIR_projectsData . $projectName . '/';
        $pathToFile = $backPath . $DIR_projectsData . $projectName . '.vejs';

        echo deleteProject($path, $pathToFile);
        break;
    default:
        echo json_encode(array('code'=> -1, "info" => "There are missing args"));
}


