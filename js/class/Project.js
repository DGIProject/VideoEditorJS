Project = function(name, dateCreation) {
    this.name = name;
    this.dateCreation = dateCreation;
    this.lastSave = 'None';

    this.username = 'demo';

    this.autoSave = false;

    this.tabListFiles = [];
    this.tabListTracks = [];

    this.tabFilesUpload = [];
    this.currentUploads = 0;
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

Project.prototype.updateText = function() {
    document.getElementById('currentProject').innerHTML = 'Project : ' + this.name + ', last save : ' + this.lastSave;

    document.getElementById('projectDropdown').innerHTML = 'Project : ' + this.name;
    document.getElementById('lastSaveDropdown').innerHTML = 'Last save : ' + this.lastSave;
};

Project.prototype.switchAutoSave = function() {
    if(!this.autoSave)
    {
        this.autoSave = setInterval(autoSaveInterval,300000);

        noty({layout: 'top', type: 'success', text: 'Sauvegarde automatique activée', timeout: '5000'});
    }
    else
    {
        clearInterval(this.autoSave);
        this.autoSave = false;

        noty({layout: 'top', type: 'success', text: 'Sauvegarde automatique désactivée', timeout: '5000'});
    }
};