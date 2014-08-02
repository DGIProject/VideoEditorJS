Project = function(name, dateCreation) {
    this.name = name;
    this.dateCreation = dateCreation;
    this.lastSave = 'none';

    this.username = 'demo';

    this.isStarted = false;
    this.isCreated = false;
};

Project.prototype.loadModal = function(type)
{
    console.log(type);

    $('#loadModal').modal(type);
};

Project.prototype.startAddFileTrack = function(id)
{
    document.getElementById('stopAddFileTrackButton').style.display = '';

    var listFilesLib = document.getElementById('listFiles');
    var filesTab = listFilesLib.getElementsByTagName('a');

    for(var i = 0; i < filesTab.length; i++)
    {
        var fileId = filesTab[i].getAttribute('fileId');

        filesTab[i].removeAttribute('onclick');
        filesTab[i].setAttribute('onclick', 'addElement(' + fileId + ', ' + id + ');');

        filesTab[i].classList.add('active');
    }
};

Project.prototype.stopAddFileTrack = function()
{
    document.getElementById('stopAddFileTrackButton').style.display = 'none';

    var listFilesLib = document.getElementById('listFiles');
    var filesTab = listFilesLib.getElementsByTagName('a');

    for(var i = 0; i < filesTab.length; i++)
    {
        var fileId = filesTab[i].getAttribute('fileId');

        filesTab[i].setAttribute('onclick', 'fileProperties(' + fileId + ');');
        filesTab[i].classList.remove('active');
    }
};

Project.prototype.newProject = function(reset)
{

    document.getElementById('nameProject').value = '';
    document.getElementById('buttonNewProject').setAttribute('onclick', 'currentProject.saveNewProject(' + reset + ');');

    $('#selectProjectModal').modal('hide');
    $('#newProjectModal').modal('show');
};

Project.prototype.saveNewProject = function(reset)
{

    var nameProject = document.getElementById('nameProject').value;

    if(nameProject != '')
    {
        $('#newProjectModal').modal('hide');

        this.stopAddFileTrack();

        if(reset)
        {
            document.getElementById('tracks').innerHTML = '';
            document.getElementById('VideoView').innerHTML = '';

            tabListElements = [];
            tabListFiles = [];
            tabListTracks = [];
        }

        this.isStarted = true;
        this.isCreated = true;
        this.name = nameProject;
        this.dateCreation = getCurrentDate();
        this.lastSave = 'none';

        this.updateTextProject();
        this.saveProject();
    }
    else
    {
        var n = noty({layout: 'topRight', type: 'error', text: 'Vous devez renseigner le nom du projet.', timeout: '5000'});
    }
};

Project.prototype.openProject = function()
{
    getListProjects('listProjects');

    $('#selectProjectModal').modal('show');
};

Project.prototype.loadProject = function(fileName)
{
    this.loadModal('show');

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', 'php/readFileProject.php', true);
    OAjax.onreadystatechange = function() {
        if (OAjax.readyState == 4 && OAjax.status == 200)
        {
            console.log(OAjax.responseText);

            var loader = new Loader(JSON.parse(OAjax.responseText));
            loader.load();
        }
    };

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send('fileName=' + fileName);
};

Project.prototype.saveProject = function()
{
    if(this.isCreated)
    {
        this.loadModal('show');

        var fileProject = new GenerateFileProject(this.name, this.dateCreation, this.lastSave, tabListElements, tabListFiles, tabListTracks);
        var contentFile = fileProject.generateMain();

        console.log(contentFile);

        var OAjax;

        if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
        else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
        OAjax.open('POST', 'php/addFileProject.php', true);
        OAjax.onreadystatechange = function() {
            if(OAjax.readyState == 4 && OAjax.status == 200)
            {
                console.log('answer : ' + OAjax.responseText);

                if(OAjax.responseText == 'true')
                {
                    currentProject.lastSave = getCurrentDate();

                    uploadAllFiles();

                    currentProject.updateTextProject();

                    currentProject.loadModal('hide');
                }
                else
                {
                    var n = noty({layout: 'topRight', type: 'error', text: 'Nous n\'arrivons pas à sauvegarder le projet.', timeout: '5000'});

                    this.loadModal('hide');
                }
            }
        };

        OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        OAjax.send('nameProject=' + this.name + '&contentFile=' + JSON.stringify(contentFile));
    }
    else
    {
        currentProject.newProject(false);
    }
};

Project.prototype.updateTextProject = function()
{
    if(this.isCreated)
    {
        document.getElementById('currentProject').innerHTML = 'Project : ' + this.name + ', last save : ' + this.lastSave;

        document.getElementById('projectDropdown').innerHTML = 'Project : ' + this.name;
        document.getElementById('lastSaveDropdown').innerHTML = 'Last save : ' + this.lastSave;
    }
};