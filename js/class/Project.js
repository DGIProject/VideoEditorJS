Project = function(name, username, dateCreation) {
    this.name = name;
    this.dateCreation = dateCreation;
    this.lastSave = 'None';

    this.username = username;

    this.autoSave = false;

    this.tabListFiles = [];
    this.tabListTracks = [];

    this.tabFilesUpload = [];
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

        noty({layout: 'topRight', type: 'success', text: 'Sauvegarde automatique activée.', timeout: '5000'});
    }
    else
    {
        clearInterval(this.autoSave);
        this.autoSave = false;

        noty({layout: 'topRight', type: 'success', text: 'Sauvegarde automatique désactivée', timeout: '5000'});
    }
};