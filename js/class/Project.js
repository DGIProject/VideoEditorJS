Project = function(name, dateCreation) {
    this.name = name;
    this.dateCreation = dateCreation;
    this.lastSave = 'aucune';

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