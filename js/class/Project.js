Project = function(name, uId, username, dateCreation) {
    this.name = name;
    this.uId = uId;

    this.dateCreation = dateCreation;
    this.lastSave = 'Aucune';

    this.username = username;

    this.autoSave = false;
    this.forceSave = false;

    this.isReady = false;

    this.tabListFiles = [];
    this.tabListTracks = [];

    this.tabFilesUpload = [];
};

Project.prototype.updateText = function() {
    eId('currentProject').innerHTML = this.name + ', ' + this.lastSave;

    eId('projectDropdown').innerHTML = this.name;
    eId('lastSaveDropdown').innerHTML = this.lastSave;
};

Project.prototype.switchAutoSave = function() {
    if(!this.autoSave)
    {
        this.autoSave = setInterval(autoSaveInterval,300000);

        eId('iconAutoSave').classList.remove('glyphicon-unchecked');
        eId('iconAutoSave').classList.add('glyphicon-check');

        noty({layout: 'topRight', type: 'success', text: 'Sauvegarde automatique activée.', timeout: '5000'});
    }
    else
    {
        clearInterval(this.autoSave);
        this.autoSave = false;

        eId('iconAutoSave').classList.remove('glyphicon-check');
        eId('iconAutoSave').classList.add('glyphicon-unchecked');

        noty({layout: 'topRight', type: 'success', text: 'Sauvegarde automatique désactivée', timeout: '5000'});
    }
};