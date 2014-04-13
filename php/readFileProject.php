<?php
include "config.php";

$fileName = $_POST['fileName'];

if (!$fp = fopen("../$DIR_projects/" . $fileName, "r"))
{
    echo "Echec de l'ouverture du fichier";

    exit;

}
else
{
    $contentFile = NULL;

    while(!feof($fp))
    {
        $line = fgets($fp,255);

        $contentFile .= $line;
    }

    fclose($fp);

    echo $contentFile;
}