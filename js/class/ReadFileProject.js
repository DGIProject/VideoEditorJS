/**
 * Created by Dylan on 11/03/2015.
 */

ReadFileProject = function(fileContent) {
    this.tabProject = JSON.parse(fileContent);

    console.log(this.tabProject);

    this.infoProject = this.tabProject.project;
    this.listFiles = this.tabProject.files;
    this.listTracks = this.tabProject.tracks;

    this.progression = 0;
    this.totalProgression = this.gTotalProgression();

    this.progressInterval = setInterval(this.analyzeProgression, 500);

    rLog('ReadFileProject : start');
};

ReadFileProject.prototype.gTotalProgression = function() {
    var totalProgression = this.listFiles.length;

    for(var i = 0; i < this.listTracks.length; i++)
    {
        totalProgression += this.listTracks[i].tabElements.length;
    }

    return totalProgression;
};

ReadFileProject.prototype.analyzeProgression = function() {
    eId('progressionBar').style.width = ((this.progression / this.totalProgression) * 100) + '%';
    eId('progressionStatus').innerHTML = 'Chargement du projet ... (' + readFileProject.progression + '/' + readFileProject.totalProgression + ')';

    if(readFileProject.progression == readFileProject.totalProgression)
    {
        rLog('ReadFileProject : finish');

        clearInterval(readFileProject.progressInterval);

        changeZoom(readFileProject.infoProject.zoom, true);
        loadM();
    }
};

ReadFileProject.prototype.setProject = function() {
    rLog('-LOAD- project : set properties');

    currentProject = new Project(this.infoProject.name.deleteAccent().replace(new RegExp(' ', 'g'), '_').toUpperCase(), usernameSession, this.infoProject.dateCreation);
    currentProject.lastSave = getHour();
    currentProject.forceSave = true;

    currentProject.updateText();
    currentProject.switchAutoSave();
};

ReadFileProject.prototype.setListFiles = function() {
    this.countGetFiles = 0;
    this.totalGetFiles = this.listFiles.length;

    for(var i = 0; i < this.listFiles.length; i++)
    {
        rLog('-LOAD- file : ' + i);

        var file = this.listFiles[i];

        var fileObject = new File(file.id, file.type, file.size, file.fileName, file.format);

        if(file.isVideo)
        {
            fileObject.makeVideo();
            this.getThumbnail(file.id, currentProject.tabListFiles.length, file.type);
        }

        if(file.isAudio)
        {
            fileObject.makeAudio();
            this.getThumbnail(file.id, currentProject.tabListFiles.length, TYPE.AUDIO);
        }

        fileObject.setDuration(file.duration);

        currentProject.tabListFiles.push(fileObject);

        addFileList(file.id, file.fileName, file.type);
    }
};

ReadFileProject.prototype.getThumbnail = function(id, row, type) {
    var fileName;

    if(type == TYPE.VIDEO)
    {
        fileName = 'THUMBNAIL_I_' + id;
    }
    else if(type == TYPE.AUDIO)
    {
        fileName = 'THUMBNAIL_A_' + id;
    }
    else
    {
        fileName = 'FILE_' + id;
    }

    var url = 'http://clangue.net/other/testVideo/data/projectsData/' + usernameSession + '/' + this.infoProject.name + '/' + fileName + '.data';

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

    /*
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(oEvent) {
        var blob = new Blob([oReq.response], {type: "image/png"});

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

    oReq.send();
    */
};

ReadFileProject.prototype.setTracks = function() {
    for(var i = 0; i < (this.listTracks.length / 2); i++)
    {
        addTrack();
    }

    for(var x = 0; x < this.listTracks.length; x++)
    {
        rLog('-LOAD- track : ' + x);

        currentProject.tabListTracks[x].tabElements = this.listTracks[x].tabElements;

        for(var y = 0; y < currentProject.tabListTracks[x].tabElements.length; y++)
        {
            var element = currentProject.tabListTracks[x].tabElements[y];
            var file = currentProject.tabListFiles[rowById(element.fileId, currentProject.tabListFiles)];

            this.setElementThumbnail(element, file.thumbnail);
        }
    }

    //this.dispatchEvent(classend);
};

ReadFileProject.prototype.setElementThumbnail = function(element, thumbnail) {
    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        rLog('-LOAD- track : thumbnail');
        //console.log(element);
        //console.log(imageThumbnail);

        element.thumbnail = imageThumbnail;

        readFileProject.progression++;
    };

    imageThumbnail.src = (element.type != TYPE.AUDIO) ? thumbnail.i : thumbnail.a;
};