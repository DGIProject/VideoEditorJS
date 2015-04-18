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
    rLog('-LOAD- project : set properties');

    currentProject = new Project(this.infoProject.name.deleteAccent().replace(new RegExp(' ', 'g'), '_').toUpperCase(), usernameSession, this.infoProject.dateCreation);
    currentProject.lastSave = getHour();
    currentProject.forceSave = true;

    currentProject.updateText();

    this.setFiles(true);
};

ReadFileProject.prototype.setFiles = function(start) {
    if(start)
    {
        this.countFiles = 0;

        if(this.listFiles.length > 0) {
            eId('listFiles').innerHTML = '';

            this.getFile(0);
        }
        else
        {
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
            console.log('finish load files');

            this.setTracks();
        }
    }
};

ReadFileProject.prototype.getFile = function(id) {
    rLog('-LOAD- file : ' + id);

    var file = this.listFiles[id];

    $('progressionStatus').innerHTML = 'Fichier : ' + file.fileName;

    var fileObject = new File(file.id, file.type, file.size, file.fileName, file.format);

    if(file.isVideo)
    {
        fileObject.makeVideo();
        this.getThumbnail(file.id, currentProject.tabListFiles.length, file.type, file.isUploaded.i);
    }

    if(file.isAudio)
    {
        fileObject.makeAudio();
        this.getThumbnail(file.id, currentProject.tabListFiles.length, TYPE.AUDIO, file.isUploaded.a);
    }

    fileObject.setDuration(file.duration);
    fileObject.isUploaded.file = file.isUploaded.file;

    currentProject.tabListFiles.push(fileObject);

    setTimeout(function() { addFileList(file.id, file.fileName, file.type); }, 500);
};

ReadFileProject.prototype.getThumbnail = function(id, row, type, uploadStatus) {
    var fileName = ((type == TYPE.AUDIO) ? 'THUMBNAIL_A_' : 'THUMBNAIL_I_') + id;
    var url = 'http://clangue.net/other/testVideo/data/projectsData/' + usernameSession + '/' + this.infoProject.name + '/' + fileName + '.data';

    /*
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        noty({layout: 'topRight', type: 'error', text: 'Erreur, navigateur incompatible avec les requêtes CORS.', timeout: '5000'});
        return;
    }

    xhr.onload = function() {
        console.log('response : ' + xhr.response);

        var blob = new Blob([xhr.response], {type: "image/png"});

        //console.log(blob, window.URL.createObjectURL(blob));

        if(type == TYPE.VIDEO || type == TYPE.IMAGE || type == TYPE.TEXT)
        {
            currentProject.tabListFiles[row].setThumbnailImage(window.URL.createObjectURL(blob));
        }
        else
        {
            currentProject.tabListFiles[row].setThumbnailAudio(window.URL.createObjectURL(blob));
        }

        readFileProject.progression++;
        readFileProject.countGetFiles++;

        if(readFileProject.countGetFiles == readFileProject.totalGetFiles)
        {
            rLog('-LOAD- files : finish');

            //readFileProject.dispatchEvent(listfilesend);

            readFileProject.setTracks();
        }
    };

    xhr.onerror = function() {
        reportError('No contact with server');

        noty({layout: 'topRight', type: 'error', text: 'Erreur, impossible de contacter le serveur.', timeout: '5000'});
    };

    xhr.responseType = 'arrayBuffer';
    xhr.send();
    */

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(oEvent) {
        var blob = new Blob([oReq.response], {type: "image/png"});

        //console.log(blob, window.URL.createObjectURL(blob));

        if(type == TYPE.VIDEO || type == TYPE.IMAGE || type == TYPE.TEXT)
        {
            currentProject.tabListFiles[row].setThumbnailImage(window.URL.createObjectURL(blob));
            currentProject.tabListFiles[row].isUploaded.i = uploadStatus;
        }
        else
        {
            currentProject.tabListFiles[row].setThumbnailAudio(window.URL.createObjectURL(blob));
            currentProject.tabListFiles[row].isUploaded.a = uploadStatus;
        }

        /*
        readFileProject.progression++;
        readFileProject.countGetFiles++;

        if(readFileProject.countGetFiles == readFileProject.totalGetFiles)
        {
            rLog('-LOAD- files : finish');

            readFileProject.setElementsTrack();
        }
        */

        readFileProject.countFiles++;
        readFileProject.setFiles(false);
    };

    oReq.send();
};

ReadFileProject.prototype.setTracks = function() {
    rLog('-LOAD- tracks : ' + this.listTracks.length);

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

    this.setElementsTrack(true);
};

ReadFileProject.prototype.setElementsTrack = function(start) {
    if(start) {
        rLog('-LOAD- elements track');

        this.countTracks = 0;
        this.countElementsTrack = 0;

        if(this.listTracks.length > 0) {
            console.log(this.listTracks[this.countTracks].tabElements.length);
            if(this.listTracks[this.countTracks].tabElements.length > 0) {
                this.setElementThumbnail(this.countTracks, this.countElementsTrack);
            }
            else
            {
                console.log('finish element track 0');

                this.finishLoadProject();
            }
        }
        else
        {
            console.log('finish element track 0');

            this.finishLoadProject();
        }
    }
    else
    {
        console.log('if: ' + this.countElementsTrack + ' - ' + this.listTracks[this.countTracks].tabElements.length);
        if(this.countElementsTrack >= this.listTracks[this.countTracks].tabElements.length) {
            this.countTracks++;
            this.countElementsTrack = 0;

            console.log('ift: ' + this.countTracks + ' - ' + this.listTracks.length);
            if(this.countTracks >= this.listTracks.length) {
                console.log('finishElement');

                this.finishLoadProject();
            }
            else
            {
                if(this.listTracks[this.countTracks].tabElements.length > 0) {
                    this.setElementThumbnail(this.countTracks, this.countElementsTrack);
                }
                else
                {
                    console.log('finish element track');

                    this.finishLoadProject();
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

    console.log('load thumbnail');
    console.log(element);

    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        rLog('-LOAD- track : thumbnail');

        //console.log(element);
        //console.log(imageThumbnail);

        element.thumbnail = imageThumbnail;

        readFileProject.countElementsTrack++;
        readFileProject.setElementsTrack(false);
    };

    imageThumbnail.src = (element.type != TYPE.AUDIO) ? file.thumbnail.i : file.thumbnail.a;
};

ReadFileProject.prototype.finishLoadProject = function() {
    currentProject.switchAutoSave();
    currentProject.isReady = true;

    loadM();
};