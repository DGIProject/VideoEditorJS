/**
 * Created by Dylan on 11/03/2015.
 */

ReadFileProject = function(fileContent) {
    this.tabProject = JSON.parse(fileContent);

    console.log(this.tabProject);

    this.infoProject = this.tabProject.project;
    this.listFiles = this.tabProject.files;
    this.listTracks = this.tabProject.tracks;

    rLog('ReadFileProject : start');
};

ReadFileProject.prototype.loadProject = function() {
    this.setProject();
};

ReadFileProject.prototype.setProject = function() {
    rLog('-LOAD PROJECT- project : set properties');

    currentProject = new Project(this.infoProject.name.deleteAccent().replace(new RegExp(' ', 'g'), '_').toUpperCase(), this.infoProject.uId, usernameSession, this.infoProject.dateCreation);
    currentProject.lastSave = getHour();
    currentProject.forceSave = true;

    currentProject.updateText();

    this.setFiles(true);
};

ReadFileProject.prototype.setFiles = function(start) {
    if(start)
    {
        rLog('-LOAD PROJECT- file : start [countFiles: ' + this.listFiles.length + ']');

        this.countFiles = 0;

        if(this.listFiles.length > 0) {
            eId('listFiles').innerHTML = '';

            this.getFile(0);
        }
        else
        {
            rLog('-LOAD PROJECT- file : end');

            this.setTracks();
        }
    }
    else
    {
        if(this.countFiles < this.listFiles.length)
        {
            this.getFile(this.countFiles);
        }
        else
        {
            rLog('-LOAD PROJECT- file end');

            this.setTracks();
        }
    }
};

ReadFileProject.prototype.getFile = function(id) {
    rLog('-LOAD PROJECT- file [id: ' + id + ']');

    var file = this.listFiles[id];

    $('progressionStatus').innerHTML = 'Fichier : ' + file.fileName;

    var fileObject = new File(file.id, file.uId, file.type, file.size, file.fileName, file.format);

    if(file.isVideo)
    {
        fileObject.makeVideo();
        this.getThumbnail(file.uId, currentProject.tabListFiles.length, file.type, file.format, file.isUploaded.i);
    }

    if(file.isAudio)
    {
        fileObject.makeAudio();
        this.getThumbnail(file.uId, currentProject.tabListFiles.length, TYPE.AUDIO, file.format, file.isUploaded.a);
    }

    fileObject.setDuration(file.duration);
    fileObject.isUploaded.file = file.isUploaded.file;

    fileObject.properties = file.properties;

    currentProject.tabListFiles.push(fileObject);

    setTimeout(function() { addFileList(file.id, file.fileName, file.type); }, 500);
};

ReadFileProject.prototype.getThumbnail = function(uId, row, type, format, uploadStatus) {
    var fileName = ((type == TYPE.AUDIO) ? 'THUMBNAIL_A_' : 'THUMBNAIL_I_') + uId + '.' + format;
    var url = 'http://clangue.net/other/testVideo/data/projectsData/' + usernameSession + '/' + this.infoProject.name + '/' + fileName;

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(oEvent) {
        var blob = new Blob([oReq.response], {type: "image/png"});

        //console.log(blob, window.URL.createObjectURL(blob));

        if(type != TYPE.AUDIO)
        {
            currentProject.tabListFiles[row].setThumbnailImage(window.URL.createObjectURL(blob));
            currentProject.tabListFiles[row].isUploaded.i = uploadStatus;
        }
        else
        {
            currentProject.tabListFiles[row].setThumbnailAudio(window.URL.createObjectURL(blob));
            currentProject.tabListFiles[row].isUploaded.a = uploadStatus;
        }

        readFileProject.countFiles++;
        readFileProject.setFiles(false);
    };

    oReq.send();
};

ReadFileProject.prototype.setTracks = function() {
    rLog('-LOAD PROJECT- track : start [countTracks: ' + this.listTracks.length + ']');

    var id = -1;
    var lastId = -1;

    for(var i = 0; i < this.listTracks.length; i++)
    {
        id = addTrack(this.listTracks[i].type);

        if(lastId >= 0) {
            setParentTracks(lastId, id);

            lastId = -1;
        }
        else
        {
            lastId = (this.listTracks[i].parent >= 0) ? id : -1;
        }

        currentProject.tabListTracks[i].tabElements = this.listTracks[i].tabElements;
    }

    rLog('-LOAD PROJECT- track : end');

    this.setElementsTrack(true);
};

ReadFileProject.prototype.setElementsTrack = function(start) {
    if(start) {
        rLog('-LOAD PROJECT- elements track : start');

        this.countTracks = 0;
        this.countElementsTrack = 0;

        if(this.listTracks.length > 0) {
            if(this.listTracks[this.countTracks].tabElements.length > 0) {
                this.setElementThumbnail(this.countTracks, this.countElementsTrack);
            }
            else
            {
                this.countTracks++;
                this.setElementsTrack(false);
            }
        }
        else
        {
            rLog('-LOAD PROJECT- elements track : end');

            this.finishLoadProject();
        }
    }
    else
    {
        if(this.countElementsTrack >= this.listTracks[this.countTracks].tabElements.length) {
            this.countTracks++;
            this.countElementsTrack = 0;

            if(this.countTracks >= this.listTracks.length) {
                rLog('-LOAD PROJECT- elements track : end');

                this.finishLoadProject();
            }
            else
            {
                if(this.listTracks[this.countTracks].tabElements.length > 0) {
                    this.setElementThumbnail(this.countTracks, this.countElementsTrack);
                }
                else
                {
                    this.setElementsTrack(false);
                }
            }
        }
        else
        {
            this.setElementThumbnail(this.countTracks, this.countElementsTrack);
        }
    }
};

ReadFileProject.prototype.setElementThumbnail = function(rowTrack, rowElement) {
    console.log(rowTrack, rowElement);

    var element = currentProject.tabListTracks[rowTrack].tabElements[rowElement];
    var file = currentProject.tabListFiles[rowById(element.fileId, currentProject.tabListFiles)];

    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        rLog('-LOAD PROJECT- elements track : thumbnail [rowTrack: ' + rowTrack + '][elementId: ' + element.id + '][type: ' + element.type + ']');

        element.thumbnail = imageThumbnail;

        readFileProject.countElementsTrack++;
        readFileProject.setElementsTrack(false);
    };

    imageThumbnail.src = (currentProject.tabListTracks[rowTrack].type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a;
};

ReadFileProject.prototype.finishLoadProject = function() {
    if(!currentProject.isReady) {
        rLog('ReadFileProject : end');

        currentProject.switchAutoSave();
        currentProject.isReady = true;

        changeZoom(this.infoProject.zoom, true);
        hLoadM();
    }
};