/**
 * Created by Dylan on 10/02/2015.
 */

function getListProjects(id, username){
    console.log(username);

    var xmlhttp = xmlHTTP();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(xmlhttp.responseText + 'ok');

            var tabListProjects = JSON.parse(xmlhttp.responseText);

            console.log(tabListProjects.length);

            if(tabListProjects.length > 0)
            {
                eId(id).innerHTML = '';

                for(var i = 0; i < tabListProjects.length; i++)
                {
                    eId(id).innerHTML += '<a href="#" onclick="loadProject(\'' + tabListProjects[i] + '\')" class="list-group-item" data-dismiss="modal">' + tabListProjects[i] + '</a>';
                }
            }
            else
            {
                eId(id).innerHTML = 'Aucun project.';
            }
        }
    };

    xmlhttp.open("POST", remoteAPIPath + "php/getListProjects.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('username=' + username);
}

function newProject(buttonBack) {
    eId('nameProject').value = '';
    eId('buttonBackAddProject').style.display = (buttonBack) ? 'initial' : 'none';

    $('#selectProjectModal').modal('hide');
    $('#alreadyExistProjectModal').modal('hide');
    $('#newProjectModal').modal('show');
}

function saveNewProject(nameProject) {
    if(nameProject != '')
    {
        $('#newProjectModal').modal('hide');

        resetInterface();

        currentProject = new Project(nameProject.deleteAccent().replace(new RegExp(' ', 'g'), '_').toUpperCase(), usernameSession, getCurrentDate());
        currentProject.updateText();
        currentProject.switchAutoSave();

        saveProject();
    }
    else
    {
        noty({layout: 'topRight', type: 'error', text: 'Vous devez renseigner le nom du projet.', timeout: '5000'});
    }
}

function openProject() {
    getListProjects('listProjects');

    $('#selectProjectModal').modal('show');
}

function loadProject(fileName) {
    loadM();

    var xmlhttp = xmlHTTP();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            readFileProject = new ReadFileProject(xmlhttp.responseText);
            readFileProject.setProject();
            readFileProject.setListFiles();

            /*
            readFileProject.listfilesend = function() {
                readFileProject.setTracks();
            };

            readFileProject.classend = function() {
                loadM();
            };
            */
        }
    };

    xmlhttp.open("POST", remoteAPIPath + "php/readFileProject.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('fileName=' + fileName);
}

function saveProject() {
    console.log('saving project ...');

    loadM();

    var fileProject = new GenerateFileProject(currentProject.name, currentProject.dateCreation, currentProject.lastSave, currentProject.tabListFiles, currentProject.tabListTracks);
    var contentFile = fileProject.generateMain();

    var xmlhttp = xmlHTTP();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log('answer : ' + xmlhttp.responseText);

            loadM();

            if(xmlhttp.responseText == 'true')
            {
                currentProject.lastSave = getHour();
                currentProject.forceSave = true;

                currentProject.updateText();
                noty({layout: 'topRight', type: 'success', text: 'Project sauvegardé.', timeout: '5000'});
            }
            else if(xmlhttp.responseText == 'alreadyExist')
            {
                $('#alreadyExistProjectModal').modal('show');
            }
            else
            {
                noty({layout: 'topRight', type: 'error', text: 'Nous n\'arrivons pas à sauvegarder le projet.', timeout: '5000'});
            }
        }
    };

    xmlhttp.open("POST", remoteAPIPath + "php/addFileProject.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('nameProject=' + currentProject.name + '&contentFile=' + JSON.stringify(contentFile) + '&forceSave=' + currentProject.forceSave);
}

function resetInterface() {
    eId('videoInfo').innerHTML = '';
    eId('videoView').innerHTML = '';

    eId('audioInfo').innerHTML = '';
    eId('audioView').innerHTML = '';

    eId('listFiles').innerHTML = '<span>Aucun fichier.</span><span class="textNote">Glissez des fichiers ou cliquez sur ajouter.</span>';

    eId('iconAutoSave').classList.remove('glyphicon-check');
    eId('iconAutoSave').classList.add('glyphicon-unchecked');

    oneSecond = 5;
    eId('zoomRange').value = 5;
    calculateTimeBar();
}

function autoSaveInterval() {
    saveProject();
}

function overwriteProject() {
    $('#alreadyExistProjectModal').modal('hide');

    currentProject.forceSave = true;

    saveProject();
}