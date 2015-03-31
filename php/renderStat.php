<?php
/**
 * Created by PhpStorm.
 * User: Guillaume
 * Date: 27/03/2015
 * Time: 17:11

 Define API roles :
        - update status file
        - create status file
        - delete status file
        - read status
 */


include "config.php" ;

function updateFile($id, $content = "")
{
   // $path = realpath(dirname(__FILE__));
    //echo $path."/../".$id;
    $file = fopen($id, "w+");
    fwrite($file, $content);
    fclose($file);
}


$a = $_GET['action'];
$id = "../".$DIR_RenderStat.$_GET['id'].".rStat";
$idRe = "../".$DIR_RenderStat."service.rStat";
//echo $id;
$content = $_GET['content'];
switch ($a)
{
    case "getStat":
        echo file_get_contents($idRe);
        break;
    case "setStat":
        updateFile($idRe, $content);
        break;
    case "read" :
        $content = file_get_contents($id);
        if ($content === false)
        {
            echo "{'code':-1}";
        }
        else
        {
            $serviceStat = json_decode(file_get_contents($idRe), true);
            $content = json_decode($content, true);
            //print_r($serviceStat);
            //print_r($content);
            //print_r();
            echo json_encode(array_merge($content, $serviceStat));
        }
        break;
    case "delete" :
        unlink($id);
        break;
    case "create" :
    case "update" :
        updateFile($id, $content);
        break;
    default :
        echo "";
}

