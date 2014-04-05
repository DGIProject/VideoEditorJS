<?php
if($_POST['nameProject'] != NULL)
{
    $pathTofilename = '../data/listProjects/' . $_GET['nameProject'] . '.wejs';

    if (is_uploaded_file($_FILES['fileProject']['tmp_name']))
    {
        echo 'success';

        move_uploaded_file($_FILES['fileProject']['tmp_name'], $pathTofilename);
    }
    else
    {
        echo 'error2';
    }
}
else
{
    echo 'error1';
}


