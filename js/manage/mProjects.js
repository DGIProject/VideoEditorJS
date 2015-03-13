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
                document.getElementById(id).innerHTML = '';

                for(var i = 0; i < tabListProjects.length; i++)
                {
                    document.getElementById(id).innerHTML += '<a href="#" onclick="loadProject(\'' + tabListProjects[i] + '\')" class="list-group-item" data-dismiss="modal">' + tabListProjects[i] + '</a>';
                }
            }
            else
            {
                document.getElementById(id).innerHTML = 'There is not projects.';
            }
        }
    };

    xmlhttp.open("POST", remoteAPIPath + "php/getListProjects.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('username=' + username);
}

function newProject() {
    document.getElementById('nameProject').value = '';

    $('#selectProjectModal').modal('hide');
    $('#newProjectModal').modal('show');
}

function saveNewProject() {
    var nameProject = document.getElementById('nameProject').value;

    if(nameProject != '')
    {
        $('#newProjectModal').modal('hide');

        resetInterface();

        currentProject = new Project(nameProject.deleteAccent().replace(' ', '_').toUpperCase(), usernameSession, getCurrentDate());
        currentProject.updateText();
        currentProject.switchAutoSave();

        saveProject();
    }
    else
    {
        var n = noty({layout: 'topRight', type: 'error', text: 'Vous devez renseigner le nom du projet.', timeout: '5000'});
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
            console.log(xmlhttp.responseText);

            var loader = new Loader(JSON.parse(xmlhttp.responseText));
            loader.load();
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

            if(xmlhttp.responseText == 'true')
            {
                currentProject.lastSave = getCurrentDate();
                currentProject.updateText();

                var n = noty({layout: 'topRight', type: 'success', text: 'Project sauvegardé.', timeout: '5000'});
            }
            else
            {
                var n = noty({layout: 'topRight', type: 'error', text: 'Nous n\'arrivons pas à sauvegarder le projet.', timeout: '5000'});
            }

            loadM();
        }
    };

    xmlhttp.open("POST", remoteAPIPath + "php/addFileProject.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('nameProject=' + currentProject.name + '&contentFile=' + JSON.stringify(contentFile));
}

function resetInterface() {
    document.getElementById('videoInfo').innerHTML = '';
    document.getElementById('videoView').innerHTML = '';

    document.getElementById('audioInfo').innerHTML = '';
    document.getElementById('audioView').innerHTML = '';

    document.getElementById('listFiles').innerHTML = 'Aucun élément.';

    document.getElementById('autoSaveProject').removeAttribute('checked');

    oneSecond = 5;
    document.getElementById('zoomRange').value = 5;
    calculateTimeBar();
}

function autoSaveInterval() {
    saveProject();
}