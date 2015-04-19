GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListFiles, tabListTracks)
{
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

    this.tabListFiles = tabListFiles;
    this.tabListTracks = tabListTracks;
};

GenerateFileProject.prototype.generateMain = function() {
    var tracks = [], files = [];

    for(var i = 0; i < this.tabListTracks.length; i++)
    {
        var track = new Track(this.tabListTracks[i].id, this.tabListTracks[i].type, null);
        track.setParent(this.tabListTracks[i].parent);
        track.tabElements = this.elementsTrack(i);

        tracks.push(track);
    }

    for(var y = 0; y < this.tabListFiles.length; y++) {
        var oldFile = this.tabListFiles[y];

        console.log(oldFile);

        var file = new File(oldFile.id, oldFile.uId, oldFile.type, oldFile.size, oldFile.fileName, oldFile.format);

        file.setDuration(oldFile.duration);

        file.isVideo = oldFile.isVideo;
        file.isAudio = oldFile.isAudio;
        file.properties = oldFile.properties;
        file.isUploaded = oldFile.isUploaded;

        files.push(file);
    }

    return {
        project: {
            name: this.nameProject,
            dateCreation: this.dateCreation,
            zoom: oneSecond
        },
        files: files,
        tracks: tracks
    };
};

GenerateFileProject.prototype.elementsTrack = function(row) {
    var elements = [];

    for(var x = 0; x < this.tabListTracks[row].tabElements.length; x++) {
        var oldElement = this.tabListTracks[row].tabElements[x];

        console.log(oldElement);

        var element = new Element(oldElement.id, oldElement.type, null, oldElement.color, {total: oldElement.totalDuration, begin: oldElement.beginDuration}, oldElement.fileId, oldElement.trackId, oldElement.marginLeft, oldElement.properties, oldElement.parent);

        element.width = oldElement.width;
        element.leftGap = oldElement.leftGap;
        element.rightGap = oldElement.rightGap;
        element.selected = false;

        elements.push(element);
    }

    return elements;
};