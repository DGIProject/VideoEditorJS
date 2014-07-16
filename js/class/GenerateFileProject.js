GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListElements, tabListFiles, tabListTracks)
{
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

    this.tabListElements = tabListElements;
    this.tabListFiles = tabListFiles;
    this.tabListTracks = tabListTracks;
};

GenerateFileProject.prototype.generateMain = function() {

    return {
        project : {
            name : this.nameProject,
            date : this.dateCreation,
            lastSave: this.lastSave
        },
        files : this.tabListFiles,
        tracks : this.tabListTracks,
        elements : this.tabListElements
    };
};