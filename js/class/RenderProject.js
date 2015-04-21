/**
 * Created by Guillaume on 14/03/2015.
 */
RenderP = function (format) {
    this.tracks = currentProject.tabListTracks;
    this.nextElement = null;
    this.elementEnd = null;
    this.commands = [];
    this.commandTracksAudio = [];
    this.commandTracksVideo = [];
    this.commandList = [];
    this.previousZoom = parseInt(document.getElementById('zoomRange').value);
    changeZoom((parseInt(document.getElementById('zoomRange').max) / 2), false);
    console.log(currentProject.tabListTracks);
    this.FORMAT = {
        MPEG4: {ext: 'mp4', codec: 'mpeg4'},
        AVI: {ext: 'avi', codec: null},
        OGG: {ext: 'ogg', codec: null},
        WEBM: {ext: 'webm', codec: null},
        TS: {ext: 'ts', codec: null},
        X264: {ext: 'mp4', codec: 'libx264'}
    };

    this.userFormat = format || this.FORMAT.MPEG4;
    console.log(this.userFormat);

    var tabVideoTrack = [];
    for (i = 0; i < currentProject.tabListTracks.length; i++) {
        if (currentProject.tabListTracks[i].type == TYPE.VIDEO) {
            tabVideoTrack.push(currentProject.tabListTracks[i]);
            console.log("vid", i);
        }
    }
    console.log("Video", tabVideoTrack.length, tabVideoTrack);

    /* for (i=0;i<tabTracks.length;i++)
     {
     trackData = this.sortAllTracks(tabTracks[i].data);
     console.log("sorted : ", trackData);

     }*/

    this.makeSingleVideoTrack(tabVideoTrack);

};

RenderP.prototype.makeSingleVideoTrack = function (tabTrack) {
    var tabElement = [];
    var trackZero = tabTrack[0];
    tabtracks = tabTrack;

    //tabTrack.shift();
    console.log(tabTrack);
    blackTab = [];
    t = 0;
    tabtracks[t].tabElements.sort(function (a, b) {
        return a.marginLeft - b.marginLeft
    });

    for (e = 0; e < tabtracks[t].tabElements.length; e++) {
        if (e == 0) {
            console.log("0 -> deb");
            if (tabtracks[t].tabElements[e].marginLeft >= oneSecond) {
                console.log("blackFirstTime");
                console.log("black from 0 to" + tabtracks[t].tabElements[e].marginLeft);
                blackTab.push({'from': 0, 'to': tabtracks[t].tabElements[e].marginLeft});
            }
            value = this.checkBlack(tabtracks[t], e);
            console.log(value);
            if (value.code)
                blackTab.push({'from': value.from, 'to': value.to});
        }
        else if (e == (tabtracks[t].tabElements.length - 1)) {
            console.log("blackEnd");
        }
        else {
            console.log("BlackOthers");
            value = this.checkBlack(tabtracks[t], e);
            console.log(value);
            if (value.code)
                blackTab.push({'from': value.from, 'to': value.to});
        }
    }
    console.log(blackTab)

};
RenderP.prototype.checkBlack = function (tabtrack, elementIndex) {
    tempIndex = elementIndex;
    tempIndex++;
    console.log(tempIndex);
    currentElement = tabtrack.tabElements[elementIndex];

    if (!(tempIndex >= tabtrack.tabElements.length)) {
        var nextElement = tabtrack.tabElements[tempIndex];
        if (nextElement.marginLeft == (currentElement.marginLeft + currentElement.width) || (nextElement.marginLeft - (currentElement.marginLeft + currentElement.width)) < oneSecond / 2) {
            return {code: false}
        }
        else {
            return {code: true, from: (currentElement.marginLeft + currentElement.width), to: nextElement.marginLeft};
        }
    }
};

RenderP.prototype.sortAllTracks = function (tabTrack) {
    for (i = 0; i < tabTrack.length; i++) {
        tabTrack[i].tabElements.sort(function (a, b) {
            return a.marginLeft - b.marginLeft
        });
    }
    return tabTrack;
};

RenderP.prototype.addCommandV = function (e) {
    var cmd = "";
    this.elementEnd = e.marginLeft + e.width
    var curentFileforElement = this.getFileInformationById(e.fileId)

    if (curentFileforElement.type == TYPE.IMAGE || curentFileforElement.type == TYPE.TEXT) {
        var codec = "";
        switch (curentFileforElement.format) {
            case "png":
                codec = "png";
                break;
            case "bmp":
                codec = "bmp";
                break;
            case "jpeg":
                codec = "mjpeg";
                break;
            case "jpg":
                codec = "mjpeg";
                break;
        }
        cmd = "-loop 1 -r 1 -c:v " + codec + " -i FILE_" + e.fileId + ".data -t " + (Math.ceil((e.width - e.rightGap) / oneSecond))
        + " -s 1280x720 -r 24 -y " + this.commands[this.t].length + ".ts"
        this.commands[this.t].push(cmd);
        this.commandList.push(cmd);
    }
    else {
        cmd = "-ss " + (e.leftGap / oneSecond) + " -i FILE_" + e.fileId + ".data -t " + (Math.ceil((e.width - e.rightGap) / oneSecond)) +
        " -s 1280x720 -y " + this.commands[this.t].length + ".ts";
        this.commands[this.t].push(cmd);
        this.commandList.push(cmd);
    }


};

RenderP.prototype.addCommandA = function (e) {
    this.elementEnd = e.marginLeft + e.width;
    var cmd = "-ss " + (e.leftGap / oneSecond) + " -i FILE_" + e.fileId + ".data -t " + (Math.ceil((e.width - e.rightGap) / oneSecond)) + " -y " + this.commands[this.t].length + ".mp3";
    this.commands[this.t].push(cmd);
    this.commandList.push(cmd);
};

RenderP.prototype.addBlackV = function (e) {
    tempIndex = e;
    tempIndex++;
    var cmd = "";
    if (!(tempIndex > this.elementInTrack.length)) {
        this.nextElement = this.elementInTrack[tempIndex];
        if (this.nextElement.marginLeft == this.elementEnd || this.nextElement.marginLeft - this.elementEnd < oneSecond / 2) {
            //fileContent += "\n element+1 sticked !";
            console.log("sticked");
        }
        else {
            console.log("black from ", this.elementEnd, "to ", this.nextElement.marginLeft);
            cmd = "-loop 1 -r 1 -c:v png -i black.png -t "
            + Math.ceil((this.nextElement.marginLeft - this.elementEnd) / oneSecond)
            + " -s 1280x720 -r 24 -y " + this.commands[this.t].length + ".ts";
            this.commands[this.t].push(cmd);
            this.commandList.push(cmd);
        }
    }
};

RenderP.prototype.addBlackA = function (e) {
    tempIndex = e;
    tempIndex++;
    if (!(tempIndex > this.elementInTrack.length)) {
        this.nextElement = this.elementInTrack[tempIndex];
        if (this.nextElement.marginLeft == this.elementEnd || this.nextElement.marginLeft - this.elementEnd < oneSecond / 2) {
            //fileContent += "\n element+1 sticked !";
            console.log("sticked");
        }
        else {
            console.log("black from ", this.elementEnd, "to ", this.nextElement.marginLeft);
            var cmd = "-ar 48000 -f s16le -acodec pcm_s16le -ac 2 -i /dev/zero -acodec libmp3lame -aq 4 -t " + Math.ceil((this.nextElement.marginLeft - this.elementEnd) / oneSecond) + " -y " + this.commands[this.t].length + ".mp3";
            this.commands[this.t].push(cmd);
            this.commandList.push(cmd);
        }
    }
};

RenderP.prototype.getFileInformationById = function (id) {
    for (i = 0; i < currentProject.tabListFiles.length; i++) {
        if (currentProject.tabListFiles[i].id == id) {
            var file = currentProject.tabListFiles[i];
        }
    }
    return file;
};
RenderP.prototype.uploadCommands = function () {
    var finalString = "";

    for (i = 0; i < this.commandList.length; i++) {
        finalString += this.commandList[i];
        if (i != this.commandList.length - 1) {
            finalString += "\n"
        }
    }
    finalString += "\n";

    var txtFile = new Blob([finalString], {type: 'text/plain', name: "command.ffm"});
    uploadFile(-1, "renderFile", txtFile, "RENDER");
};
