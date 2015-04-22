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
    //changeZoom((parseInt(document.getElementById('zoomRange').max)/2), false);

    this.FORMAT = {
        MPEG4 : { ext : 'mp4', codec : 'mpeg4'},
        AVI : {ext : 'avi', codec : null},
        OGG : {ext : 'ogg', codec : null},
        WEBM : {ext : 'webm', codec : null},
        TS : {ext : 'ts' , codec : null},
        X264 : {ext : 'mp4', codec : 'libx264'}
    };

    this.userFormat = format || this.FORMAT.MPEG4;
    //console.log(this.userFormat);

    this.tabVideoTrack = [];
    for (i = 0; i < this.tracks.length; i++) {
        if (this.tracks[i].type == TYPE.VIDEO) {
            this.tabVideoTrack.push(this.tracks[i]);
            console.log("vid", i);
        }
    }
    console.log("VideoTab", this.tabVideoTrack);


    this.t = 0;
    console.log(this.t);
    for (t = 0; t<this.tracks.length; t++) {
        this.t = t;
        console.log(this.t);
        this.tracks[t].tabElements.sort(function (a, b) {
            console.log("tris");
            return a.marginLeft - b.marginLeft
        }); //sort pour avoir les element dans le bon ordre des marges

       // this.commands.push([]);

        this.elementInTrack = this.tracks[t].tabElements;

        console.log("track ", t, "elementT", this.elementInTrack);

        for (var e = 0; e < this.elementInTrack.length; e++) {
            console.log("element n°", e);
            if (e == 0) {
                console.log("0 -> deb");
                if (this.elementInTrack[e].marginLeft >= oneSecond) {
                    if (this.tracks[t].type == TYPE.VIDEO)
                    {
                        this.findOnTrackB(rowById(this.tracks[t].id, this.tabVideoTrack)+1, 0,this.elementInTrack[e].marginLeft, this.elementInTrack[e] );
                    }
                }

                this.getBlack(this.tabVideoTrack[t],e);
            }
            else if (e == (this.elementInTrack.length - 1)) {
                console.log("length -1");
            }
            else {
                console.log("not -1");
                this.getBlack(this.tabVideoTrack[t], e);
            }
            console.log('End !!')

        }

       /* if (this.tracks[t].tabElements.length > 0) {
            var lastCmd = "";
            //console.log(this.commands[t], this.commands);
            if (this.commands[t].length > 1) {
                lastCmd = '-i "concat:';
                var ending = ((this.tracks[t].type == TYPE.VIDEO) ? " -c mpeg4" : "" )+" -y ";
                for (i = 0; i < this.commands[t].length; i++) {
                    lastCmd += ((this.tracks[t].type == TYPE.AUDIO) ? "" + i + ".mp3|" : "" + i + ".ts|");
                }
                //lastCmd += complexfliter;
                lastCmd = lastCmd.slice(0, -1);
                lastCmd += '"' + ending;
                lastCmd += (this.tracks[t].type == TYPE.AUDIO) ? " track_" + t + ".mp3" : " track_" + t + ".mp4";
            }
            else {
                lastCmd = (this.tracks[t].type == TYPE.AUDIO) ? "-i 0.mp3 -c copy -y track_" + t + ".mp3" : "-i 0.ts -c mpeg4 -y track_" + t + ".mp4";
            }
            (this.tracks[t].type == TYPE.AUDIO) ? this.commandTracksAudio.push([t, lastCmd]) : this.commandTracksVideo.push([t, lastCmd]);
            this.commands[t].push(lastCmd);
            this.commandList.push(lastCmd);
        }*/
    }

   /* var finalAudio = "audio.mp3";
    // Merge audio tracks into single one
    if (this.commandTracksAudio.length > 1) {
        var cmd = "";
        for (i = 0; i < this.commandTracksAudio.length; i++) {
            var trackId = this.commandTracksAudio[i][0];
            cmd += "-i track_" + trackId + ".mp3 ";
        }
        cmd += "amix=inputs=" + this.commandTracksAudio.length + ":duration=longest:dropout_transition=2 audio.mp3";
        this.commandList.push(cmd);
        finalAudio = "audio.mp3";
    }
    else {
        finalAudio = "track_1.mp3";
    }*/


    // merge audio and video
   /* if (this.commandTracksAudio>0 || this.commandTracksVideo>0)
    {
        console.log("-i "+ ((this.commandTracksVideo.length > 0) ? "track_0.mp4 " : "") +" " + ((this.commandTracksAudio.length > 0) ? "-i " + finalAudio : "") + " -s 1280x720 "+((this.FORMAT[this.userFormat].codec != null)?"-c:v "+this.FORMAT[this.userFormat].codec:"")+" final."+this.FORMAT[this.userFormat].ext);
        this.commandList.push("-i "+ ((this.commandTracksVideo.length > 0) ? "track_0.mp4 " : "") + " " + ((this.commandTracksAudio.length > 0) ? "-i " + finalAudio : "") + " -s 1280x720 "+((this.FORMAT[this.userFormat].codec != null)?"-c:v "+this.FORMAT[this.userFormat].codec:"")+" final."+this.FORMAT[this.userFormat].ext);

        this.commandList.push("-i "+ ((this.commandTracksVideo.length > 0) ? "track_0.mp4 " : "") + " " + ((this.commandTracksAudio.length > 0) ? "-i " + finalAudio : "") + " -s 1280x720 -c:v "+this.FORMAT.X264.codec+" final_WEB."+this.FORMAT.X264.ext);

        changeZoom(this.previousZoom, false);
        this.uploadCommands();
    }*/

};

RenderP.prototype.getBlack = function(track, elementIndex){
    var tabElement = track.tabElements;
    var Element = tabElement[elementIndex];
    console.log('tabElement', tabElement, parseInt(elementIndex+1), elementIndex);
    if (parseInt(elementIndex+1)<tabElement.length)
    {
        var NextElement = tabElement[elementIndex+1];

            var from = Element.width+Element.marginLeft;
            var to = NextElement.marginLeft;
            console.log(from, to, "Value to send ----------");
            this.findOnTrackB(rowById(track.id, this.tabVideoTrack)+1, from,to, NextElement );

        
    }
    else
    {
        console.log("Out!");
    }

}
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
    this.elementEnd = e.marginLeft + e.width

    var curentFileforElement = this.getFileInformationById(e.fileId)
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
        if (this.nextElement.marginLeft == this.elementEnd || this.nextElement.marginLeft - this.elementEnd < oneSecond/2) {
            console.log("sticked");
        }
        else {
            console.log("black from ", this.elementEnd, "to ", this.nextElement.marginLeft);
            cmd = "-loop 1 -r 1 -c:v png -i black.png -t "
            + Math.ceil((this.nextElement.marginLeft - this.elementEnd) / oneSecond)
            + " -s 1280x720 -r 24 -y " + this.commands[this.t].length + ".ts";

            //this.findOnTrackB(rowById(this.tracks[t].id, this.tabVideoTrack)+1, this.elementEnd ,this.nextElement.marginLeft, this.elementInTrack[e] );

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
        if (this.nextElement.marginLeft == this.elementEnd || this.nextElement.marginLeft - this.elementEnd < oneSecond/2) {
            //fileContent += "\n element+1 sticked !";
            console.log("sticked");
        }
        else {
            console.log("black from ", this.elementEnd, "to ", this.nextElement.marginLeft);
            var cmd  = "-ar 48000 -f s16le -acodec pcm_s16le -ac 2 -i /dev/zero -acodec libmp3lame -aq 4 -t " + Math.ceil((this.nextElement.marginLeft - this.elementEnd) / oneSecond) + " -y " + this.commands[this.t].length + ".mp3";
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
RenderP.prototype.findOnTrackB = function (tId, from, to, element) {
    console.log("trying ........");

    if (tId>=this.tabVideoTrack.length){ console.log("does not exist"); return false;}

    this.tabVideoTrack[tId].tabElements.sort(function (a, b) {
        return a.marginLeft - b.marginLeft
    });

    for (e=0;e<this.tabVideoTrack[tId].tabElements.length;e++)
    {
        var newTrackElement = this.tabVideoTrack[tId].tabElements[e];

        console.log("element ",e,from,newTrackElement.marginLeft, to,newTrackElement.marginLeft+newTrackElement.width);

        if (from<=newTrackElement.marginLeft && to<=newTrackElement.marginLeft+newTrackElement.width)
        {
            console.log("in black !!!!");

            if(newTrackElement.marginLeft >= element.marginLeft && (newTrackElement.marginLeft + newTrackElement.width) <= (element.marginLeft + element.width))
            {
                console.log('-RENDER- collision in');

                deleteElement(tId, e);
            }
            else
            {
                if(newTrackElement.marginLeft <= element.marginLeft && (newTrackElement.marginLeft + newTrackElement.width) >= (element.marginLeft + element.width))
                {
                    console.log('-RENDER- collision between');

                    var newMarginLeft = element.marginLeft + element.width;
                    var widthNewElement = newTrackElement.width - /*(selectedElement.width + (selectedElement.marginLeft - element.marginLeft))*/ ((element.marginLeft + element.width) - element.marginLeft);
                    var newBeginDuration = (newTrackElement.beginDuration + ((element.marginLeft - newTrackElement.marginLeft) / oneSecond));

                    console.log(newMarginLeft, widthNewElement, newBeginDuration);

                    newTrackElement.width = element.marginLeft - newTrackElement.marginLeft;

                    addElementTrack(newTrackElement.fileId, this.tabVideoTrack[tId], newMarginLeft, newBeginDuration, {resize: true, width: widthNewElement, leftGap: element.width}, (newTrackElement.parent >= 0));
                    setPropertiesParent(this.tabVideoTrack[tId].parent, this.tabVideoTrack[tId].tabElements);
                }

                if((element.marginLeft + element.width) >= newTrackElement.marginLeft && (element.marginLeft + element.width) <= (newTrackElement.marginLeft + newTrackElement.width))
                {
                    console.log('-RENDER- collision before');

                    newTrackElement.leftGap += (element.marginLeft + element.width) - newTrackElement.marginLeft;

                    newTrackElement.width = (newTrackElement.marginLeft + newTrackElement.width) - (element.marginLeft + element.width);
                    newTrackElement.marginLeft = (newTrackElement.marginLeft + newTrackElement.width) - ((newTrackElement.marginLeft + newTrackElement.width) - (element.marginLeft + element.width));

                    setPropertiesParent(this.tabVideoTrack[tId].parent,  this.tabVideoTrack[tId].tabElements);
                }

                if(element.marginLeft >= newTrackElement.marginLeft && element.marginLeft <= (newTrackElement.marginLeft + newTrackElement.width))
                {
                    console.log('-RENDER- collision after');

                    newTrackElement.rightGap += (newTrackElement.marginLeft + newTrackElement.width) - element.marginLeft;

                    newTrackElement.width = element.marginLeft - newTrackElement.marginLeft;

                    setPropertiesParent(this.tabVideoTrack[tId].parent,  this.tabVideoTrack[tId].tabElements);
                }
            }


        }
        else
        {
            console.log("NotinBalck");
        }


    }
};