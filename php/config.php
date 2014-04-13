<?php

//TODO: Ce fichier va traiter la configuration pour le chemin de ffmpeg par explemple et autre information de config pour la generation du fichier final
// Base directory is '/' of php installation. For linux apache/php server it correspond to /var/www/

$systemSep = '/'; // Can be \ on windows php servers but / en linux Servers

function createDirectory($dir)
{
    if (!is_dir("../".$dir))
    {
        mkdir("../".$dir.'/', 0777);
    }
}

$DIR_data = 'data';
// You can remove "$DIR_data.$systemSep" if you want to place data in another place or in the root directory.
$DIR_projects = $DIR_data.$systemSep.'projects';
$DIR_projectsData = $DIR_data.$systemSep.'projectsData';
$DIR_ffmpegCmdFiles = $DIR_data.$systemSep.'CommandFile';

// We create directory if they not exist.

createDirectory($DIR_ffmpegCmdFiles);
createDirectory($DIR_projectsData);
createDirectory($DIR_projects);
createDirectory($DIR_data);

$fileSufixe = uniqid();


