Project = function(name, dateCreation) {
    this.name = name;
    this.dateCreation = dateCreation;
    this.lastSave = 'aucune';

    this.isCreated = false;
};

Project.prototype.loadModal = function(type)
{
    $('#loadModal').modal(type);
};

Project.prototype.startAddFileTrack = function(id)
{
    document.getElementById('stopAddFileTrackButton').style.display = '';

    var listFilesLib = document.getElementById('listFiles');
    var filesTab = listFilesLib.getElementsByTagName('a');

    for(var i = 0; i < filesTab.length; i++)
    {
        var idFile = filesTab[i].getAttribute('idFile');

        filesTab[i].removeAttribute('onclick');
        filesTab[i].setAttribute('onclick', 'addElement(' + idFile + ', ' + id + ');');

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
        var idFile = filesTab[i].getAttribute('idFile');

        filesTab[i].setAttribute('onclick', 'fileProperties(' + idFile + ');');
        filesTab[i].classList.remove('active');
    }
};