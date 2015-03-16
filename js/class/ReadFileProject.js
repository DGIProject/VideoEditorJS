/**
 * Created by Dylan on 11/03/2015.
 */

ReadFileProject = function(fileContent) {
    this.tabProject = JSON.parse(fileContent);

    this.infoProject = this.tabProject.project;
    this.listFiles = this.tabProject.files;
    this.listTracks = this.tabProject.tracks;

    loadM();
};

ReadFileProject.prototype.setProject = function() {
    currentProject = new Project(this.infoProject.name.deleteAccent().replace(new RegExp(' ', 'g'), '_').toUpperCase(), usernameSession, this.infoProject.date);
    currentProject.updateText();
    currentProject.switchAutoSave();
};

ReadFileProject.prototype.setListFiles = function() {
    this.countGetFiles = 0;
    this.totalGetFiles = this.listFiles.length;

    for(var i = 0; i < this.listFiles.length; i++)
    {
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

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(oEvent) {
        var blob = new Blob([oReq.response], {type: "image/png"});

        console.log(blob, window.URL.createObjectURL(blob));

        if(type == TYPE.VIDEO || type == TYPE.IMAGE || type == TYPE.TEXT)
        {
            currentProject.tabListFiles[row].setThumbnailImage(window.URL.createObjectURL(blob));
        }
        else
        {
            currentProject.tabListFiles[row].setThumbnailAudio(window.URL.createObjectURL(blob));
        }

        readFileProject.countGetFiles++;

        if(readFileProject.countGetFiles == readFileProject.totalGetFiles)
        {
            //readFileProject.dispatchEvent(listfilesend);

            //readFileProject.setTracks();

            console.log('done');
        }
    };

    oReq.send();
};

ReadFileProject.prototype.setTracks = function() {
    for(var i = 0; i < (this.listTracks.length / 2); i++)
    {
        addTrack();
    }

    for(var x = 0; x < this.listTracks.length; x++)
    {
        currentProject.tabListTracks[x].tabElements = this.listTracks[x].tabElements;
        this.setElementsThumbnail(x);

        drawElements(x);
    }

    //this.dispatchEvent(classend);

    loadM();
};

ReadFileProject.prototype.setElementsThumbnail = function(rowTrack) {
    for(var i = 0; i < currentProject.tabListTracks[rowTrack].tabElements.length; i++)
    {
        var element = currentProject.tabListTracks[rowTrack].tabElements[i];
        var file = currentProject.tabListFiles[rowById(element.fileId, currentProject.tabListFiles)];

        if(element.type == TYPE.VIDEO)
        {
            element.thumbnail = file.thumbnail.i;
        }
        else
        {
            element.thumbnail = file.thumbnail.a;
        }
    }
};