GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListFiles, tabListTracks)
{
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

    this.tabListFiles = tabListFiles;
    this.tabListTracks = tabListTracks;
};

GenerateFileProject.prototype.generateMain = function() {
    var tracks = [];

    for(var i = 0; i < this.tabListTracks.length; i++)
    {
        var track = new Track(this.tabListTracks[i].id, this.tabListTracks[i].type, null);
        track.setParent(this.tabListTracks[i].parent);
        track.tabElements = this.tabListTracks[i].tabElements;

        tracks.push(track);
    }

    console.log(tracks, currentProject.tabListTracks);

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