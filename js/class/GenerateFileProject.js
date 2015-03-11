GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListFiles, tabListTracks)
{
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

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
        tracks : this.tabListTracks
    };
};