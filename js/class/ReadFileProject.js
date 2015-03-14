/**
 * Created by Dylan on 11/03/2015.
 */

ReadFileProject = function(fileContent) {
    this.tabProject = JSON.parse(fileContent);

    this.infoProject = this.tabProject.project;
    this.listFiles = this.tabProject.files;
    this.listTracks = this.tabProject.tracks;
};

ReadFileProject.prototype.setProject = function() {
    currentProject = new Project(this.infoProject.name.deleteAccent().replace(new RegExp(' ', 'g'), '_').toUpperCase(), usernameSession, this.infoProject.date);
    currentProject.updateText();
    currentProject.switchAutoSave();
};

ReadFileProject.prototype.setListFiles = function() {
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
    else if(type == TYPE.IMAGE)
    {
        fileName = 'FILE_' + id;
    }
    else
    {
        fileName = 'THUMBNAIL_A_' + id;
    }

    console.log('projectName=' + this.infoProject.name + '&fileName=' + fileName);

    var imageClose = new Image();

    imageClose.onload = function() {
        console.log(window.URL.createObjectURL(new Blob([imageClose])));

        console.log(imageClose + 'ok');
    };

    imageClose.src = 'http://clangue.net/other/testVideo/data/projectsData/' + usernameSession + '/' + this.infoProject.name + '/' + fileName + '.data';

    /*
    var xmlhttp = xmlHTTP();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            if(xmlhttp.responseText == 'ERROR')
            {
                document.getElementById('toolsFile' + id).innerHTML = 'Error thumbnail.';
            }
            else
            {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(new Blob([xmlhttp.responseText]));

                console.log(fileReader);

                var url = window.URL.createObjectURL(new Blob([fileReader.result]));
                var url2 = window.URL.createObjectURL(new Blob([xmlhttp.responseText], {type: 'image/png'}));

                console.log(url, url2);

                /*
                var fileReader = new FileReader();
                fileReader.read
                var blob = new Blob([xmlhttp.responseText], {type: 'image/png'});
                console.log(blob);

                if(type == TYPE.VIDEO || type == TYPE.IMAGE)
                {
                    currentProject.tabListFiles[row].setThumbnailImage(window.URL.createObjectURL(blob));
                }
                else
                {
                    currentProject.tabListFiles[row].setThumbnailAudio(window.URL.createObjectURL(blob));
                }
            }
        }
    };

    xmlhttp.open("POST", remoteAPIPath + "php/getThumbnail.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('projectName=' + this.infoProject.name + '&fileName=' + fileName);
    */
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