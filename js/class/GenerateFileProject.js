GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListFiles, tabListTracks)
{
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

    this.tabListFiles = tabListFiles;
    this.tabListTracks = tabListTracks;
};

GenerateFileProject.prototype.generateMain = function() {
    /*
    var tracks = this.tabListTracks;

    console.log(tracks, currentProject.tabListTracks);

    for(var i = 0; i < tracks.length; i++)
    {
        tracks[i].canvas = null;
    }

    console.log(tracks, currentProject.tabListTracks);
    */

    return {
        project: {
            name: this.nameProject,
            dateCreation: this.dateCreation,
            zoom: oneSecond
        },
        files: this.tabListFiles,
        tracks: tracks
    };
};