GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListFiles, tabListTracks)
{
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

    this.tabListFiles = tabListFiles;
    this.tabListTracks = tabListTracks;
};

GenerateFileProject.prototype.generateMain = function() {
    for(var i = 0; i < this.tabListTracks.length; i++)
    {
        this.tabListTracks[i].canvas = null;
    }

    return {
        project: {
            name: this.nameProject,
            dateCreation: this.dateCreation,
            zoom: oneSecond
        },
        files: this.tabListFiles,
        tracks: this.tabListTracks
    };
};