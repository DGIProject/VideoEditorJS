<?php
$fileName = $_POST['fileName'];

if (!$fp = fopen('../data/listProjects/' . $fileName, "r"))
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