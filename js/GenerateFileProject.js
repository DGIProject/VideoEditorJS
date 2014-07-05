GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListElements, tabListFiles, tabListTextElements, tabListTracks) {
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

    this.tabListElements = tabListElements;
    this.tabListFiles = tabListFiles;
    this.tabListTextElements = tabListTextElements;
    this.tabListTracks = tabListTracks;
};

GenerateFileProject.prototype.generateMain = function() {

    var informations = {
        project : {
            name : this.nameProject,
            date : this.dateCreation,
            lastSave: this.lastSave
        },
        elements : this.tabListElements,
        tracks : this.tabListTracks,
        files : this.tabListFiles
    };

    console.log(informations)

    return informations;
};