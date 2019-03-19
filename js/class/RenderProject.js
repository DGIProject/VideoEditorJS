/**
 * Created by Guillaume on 14/03/2015.
 * Render Class, to make a render File corresponding to the visual content.
 */
RenderP = function (format) {
    this.tracks = JSON.parse(JSON.stringify(currentProject.tabListTracks));
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
    this.otherTrack = [];
    this.tabVideoTrack = [];

    this.isolateVideoTracks();
    console.log("tabs", this.tabVideoTrack, this.otherTrack);

    if (this.tabVideoTrack.length>0) {i
	this.mergeMultipleVideoTracks();
    }


    this.t = 0;
	
    this.processTracks();

    console.log("----------------------------RENDER FINAL COMMAND-------------------------");
    var finalAudio = "audio.mp3";
    // Merge audio tracks into single one
    if (this.commandTracksAudio.length > 1) {
        cmd = "";
        for (i = 0; i < this.commandTracksAudio.length; i++) {
            var trackId = this.commandTracksAudio[i][0];
            cmd += "-i track_" + trackId + ".mp3 ";
        }
        cmd += " -filter_complex amerge="+this.commandTracksAudio.length+" audio.mp3";
        this.commandList.push(cmd);
        finalAudio = "audio.mp3";
    }
    else {
        if (this.commandTracksAudio.length>0)
        {
            finalAudio = "track_"+this.commandTracksAudio[0][0]+".mp3";
        }

    }

    // merge audio and video
    if (this.commandTracksAudio.length>0 || this.commandTracksVideo.length>0)
    {
        console.log("-i "+ ((this.commandTracksVideo.length > 0) ? "track_"+this.commandTracksVideo[0][0]+".mp4 " : "") +" " + ((this.commandTracksAudio.length > 0) ? "-i " + finalAudio : "") + " -s 1280x720 "+((this.FORMAT[this.userFormat].codec != null)?"-c:v "+this.FORMAT[this.userFormat].codec:"")+" -q:v 1 final."+this.FORMAT[this.userFormat].ext);
        this.commandList.push("-i "+ ((this.commandTracksVideo.length > 0) ?  "track_"+this.commandTracksVideo[0][0]+".mp4 "  : "") + " " + ((this.commandTracksAudio.length > 0) ? "-i " + finalAudio : "") + " -s 1280x720 "+((this.FORMAT[this.userFormat].codec != null)?"-c:v "+this.FORMAT[this.userFormat].codec:"")+" -q:v 1 final."+this.FORMAT[this.userFormat].ext);
        this.commandList.push("-i "+ ((this.commandTracksVideo.length > 0) ? "track_"+this.commandTracksVideo[0][0]+".mp4 " : "") + " " + ((this.commandTracksAudio.length > 0) ? "-i " + finalAudio : "") + " -s 1280x720 -c:v "+this.FORMAT.X264.codec+" -q:v 1 final_WEB."+this.FORMAT.X264.ext);

       // changeZoom(this.previousZoom, false);
        this.uploadCommands();
    }

};

RenderP.prototype.processTracks = function(){
    for (var t = 0; t < this.otherTrack.length; t++) {
        //Processing each track
        this.t = t;
        this.otherTrack[t].tabElements.sort(function (a, b) {
            console.log("tris");
            return a.marginLeft - b.marginLeft
        }); //sort pour avoir les element dans le bon ordre des marges

        this.commands.push([]);

        this.elementInTrack = this.otherTrack[t].tabElements;

        console.log("track ", t, "elementT", this.elementInTrack);
        var cmd;
        //processing each element.
        for (var e = 0; e < this.elementInTrack.length; e++) {
            console.log("element n°", e);

            if (e == 0) {
                console.log("0 -> deb");
                if (this.elementInTrack[e].marginLeft >= oneSecond) {

                    cmd = (this.otherTrack[t].type == TYPE.AUDIO) ? "-ar 48000 -f s16le -acodec pcm_s16le -ac 2 -i /dev/zero -acodec libmp3lame -aq 4 -t " + Math.ceil(this.elementInTrack[e].marginLeft / oneSecond) + " -y " + (this.commands[this.t].length) + ".mp3" : "-f rawvideo -pix_fmt rgb24 -c:v mpeg2video -r 1 -i /dev/zero -t " +  Math.ceil(this.elementInTrack[e].marginLeft / oneSecond) + " -s 1280x720 -y " + this.commands[this.t].length + ".ts";
                    this.commandList.push(cmd);
                    this.commands[this.t].push(cmd);

                }

                (this.otherTrack[t].type == TYPE.AUDIO) ? this.addCommandA(this.elementInTrack[e]) : this.addCommandV(this.elementInTrack[e]);
                ((this.elementInTrack.length - 1) != e) ? ((this.otherTrack[t].type == TYPE.AUDIO) ? this.addBlackA(e) : this.addBlackV(e)) : null;

            }
            else if (e == (this.elementInTrack.length - 1)) {
                console.log("length -1");
                (this.otherTrack[t].type == TYPE.AUDIO) ? this.addCommandA(this.elementInTrack[e]) : this.addCommandV(this.elementInTrack[e]);
               if ((maxA-maxV)>oneSecond && this.otherTrack[t].type != TYPE.AUDIO )
               {
                   cmd = "-f rawvideo -pix_fmt rgb24 -s 1280x720 -r 1 -i /dev/zero -t " +  Math.ceil((maxA-maxV) / oneSecond) + "  -y " + this.commands[this.t].length + ".ts";
                   this.commandList.push(cmd);
                   this.commands[this.t].push(cmd);
               }
            }
            else {
                console.log("not -1");
                (this.otherTrack[t].type == TYPE.AUDIO) ? this.addCommandA(this.elementInTrack[e]) : this.addCommandV(this.elementInTrack[e]);
                (this.otherTrack[t].type == TYPE.AUDIO) ? this.addBlackA(e) : this.addBlackV(e);
            }
            console.log('End !!')

        }

        if (this.otherTrack[t].tabElements.length > 0) {
            //Concat each track element into single one
            var lastCmd = "";
            console.log(this.commands[t], this.commands);
            if (this.commands[t].length > 1) {
                lastCmd = '-i "concat:';
                var ending = ((this.otherTrack[t].type == TYPE.VIDEO) ? " -c:v mpeg4" : "" )+" -y ";
                for (i = 0; i < this.commands[t].length; i++) {
                    lastCmd += ((this.otherTrack[t].type == TYPE.AUDIO) ? "" + i + ".mp3|" : "" + i + ".ts|");
                }
                lastCmd = lastCmd.slice(0, -1);
                lastCmd += '"' + ending;
                lastCmd += (this.otherTrack[t].type == TYPE.AUDIO) ? " track_" + t + ".mp3" : " track_" + t + ".mp4";
            }
            else {
                lastCmd = (this.otherTrack[t].type == TYPE.AUDIO) ? "-i 0.mp3 -c copy -y track_" + t + ".mp3" : "-i 0.ts -c mpeg4 -y track_" + t + ".mp4";
            }
            (this.otherTrack[t].type == TYPE.AUDIO) ? this.commandTracksAudio.push([t, lastCmd]) : this.commandTracksVideo.push([t, lastCmd]);
            this.commands[t].push(lastCmd);
            this.commandList.push(lastCmd);
        }
    }

};

RenderP.prototype.isolateVideoTracks = function(){
    //Isolating video tracks
    for (var i = 0; i < this.tracks.length; i++) {
        if (this.tracks[i].type == TYPE.VIDEO) {
            this.tabVideoTrack.push(JSON.parse(JSON.stringify(this.tracks[i])));
            console.log("vid", i);
        }
        else
        {
            this.otherTrack.push(JSON.parse(JSON.stringify(this.tracks[i])));
        }
    }
};

RenderP.prototype.mergeMultipleVideoTracks = function(){
    //Convert multiple video track into Single one
    var index = this.tabVideoTrack.length;
    console.log('index', index);
    do
    {
        this.makeSingleVideoTrack();
        index--;
        console.log('indexN', index)
    }
    while (index > 1);

    console.log("Video track", this.tabVideoTrack);

    this.tabVideoTrack[0].tabElements.sort(function (a, b) {
        console.log("tris");
        return a.marginLeft - b.marginLeft
    });
    var maxA = 0;
    var maxV = 0;
    if (this.tabVideoTrack[0].tabElements.length > 0) {
        maxV = this.tabVideoTrack[0].tabElements[this.tabVideoTrack[0].tabElements.length - 1].marginLeft + this.tabVideoTrack[0].tabElements[this.tabVideoTrack[0].tabElements.length - 1].width;
    }


    //Get max size
    for (i = 0; i < this.otherTrack.length; i++) {
        for (var el = 0; el < this.otherTrack[i].tabElements.length; el++) {
            var size = this.otherTrack[i].tabElements[el].marginLeft + this.otherTrack[i].tabElements[el].width;
            if (size > maxA) {
                maxA = size
            }
        }
    }

    this.otherTrack.push(this.tabVideoTrack[0]);
};

/* This function, is made, to detect "Black" elements, and check if another element exist on others tracks*/

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
            var trackId = rowById(track.id, this.tabVideoTrack)+1;
            if (trackId<this.tabVideoTrack.length)
            {
                console.log("tabSize", this.tabVideoTrack[trackId].tabElements.length);
                for (var i=0;i<this.tabVideoTrack[trackId].tabElements.length;i++)
                {
                    this.findOnTrackB(rowById(track.id, this.tabVideoTrack)+1, from,to, NextElement );
                }
            }
    }
    else
    {
        console.log("Out!");
    }
};
/* Add a video command */
RenderP.prototype.addCommandV = function (e) {
    var cmd = "";
    this.elementEnd = e.marginLeft + e.width;
    var curentFileforElement = this.getFileInformationById(e.fileId);

    if (curentFileforElement.type == TYPE.IMAGE || curentFileforElement.type == TYPE.TEXT) {

        cmd = "-loop 1 -r 1 -i FILE_" + currentProject.tabListFiles[rowById(e.fileId,currentProject.tabListFiles)].uId + "."+currentProject.tabListFiles[rowById(e.fileId,currentProject.tabListFiles)].format+" -t " + (Math.ceil((e.width - e.rightGap) / oneSecond))
        + " -s 1280x720 -r 24 -q:v 1 -y " + this.commands[this.t].length + ".ts";
        this.commands[this.t].push(cmd);
        this.commandList.push(cmd);
    }
    else {
        cmd = "-ss " + (e.leftGap / oneSecond) + " -i FILE_" + currentProject.tabListFiles[rowById(e.fileId,currentProject.tabListFiles)].uId + "."+currentProject.tabListFiles[rowById(e.fileId,currentProject.tabListFiles)].format+" -t " + (Math.ceil((e.width - e.rightGap) / oneSecond)) +
        " -s 1280x720 -y -q:v 1 " + this.commands[this.t].length + ".ts";
        this.commands[this.t].push(cmd);
        this.commandList.push(cmd);
    }


};
/* Add an audioCommand */
RenderP.prototype.addCommandA = function (e) {
    this.elementEnd = e.marginLeft + e.width;

    var cmd = "-ss " + (e.leftGap / oneSecond) + " -i FILE_" + currentProject.tabListFiles[rowById(e.fileId,currentProject.tabListFiles)].uId + "." + currentProject.tabListFiles[rowById(e.fileId,currentProject.tabListFiles)].format + " -af 'volume="+ e.properties.volume/100+"'  -t " + (Math.ceil((e.width - e.rightGap) / oneSecond)) + " -y " + this.commands[this.t].length + ".mp3";
    this.commands[this.t].push(cmd);
    this.commandList.push(cmd);

};
/* Add a "black" element */
RenderP.prototype.addBlackV = function (e) {
    var tempIndex = e;
    tempIndex++;
    var cmd = "";
    if (!(tempIndex > this.elementInTrack.length)) {
        this.nextElement = this.elementInTrack[tempIndex];
        if (this.nextElement.marginLeft == this.elementEnd || this.nextElement.marginLeft - this.elementEnd < oneSecond/2) {
            console.log("sticked");
        }
        else {
            console.log("black from ", this.elementEnd, "to ", this.nextElement.marginLeft);

            cmd = "-f rawvideo -pix_fmt rgb24 -s 1280x720 -r 1 -i /dev/zero -t "
            + Math.ceil((this.nextElement.marginLeft - this.elementEnd) / oneSecond)
            + " -y " + this.commands[this.t].length + ".ts";

            this.commands[this.t].push(cmd);
            this.commandList.push(cmd);
        }
    }
};
/* Add a black element */
RenderP.prototype.addBlackA = function (e) {
    var tempIndex = e;
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
/* Get File information with Id */
RenderP.prototype.getFileInformationById = function (id) {
    for (var i = 0; i < currentProject.tabListFiles.length; i++) {
        if (currentProject.tabListFiles[i].id == id) {
            var file = currentProject.tabListFiles[i];
        }
    }
    return file;
};
/* This function upload all command to the server for processing */
RenderP.prototype.uploadCommands = function () {
    var finalString = "";

    for (var i = 0; i < this.commandList.length; i++) {
        finalString += this.commandList[i];
        if (i != this.commandList.length - 1) {
            finalString += "\n"
        }
    }
    finalString += "\n";

    var txtFile = new Blob([finalString], {type: 'text/plain', name: "command.ffm"});
    uploadFile(-1, uId() ,"renderFile", txtFile, "RENDER")
};
/* This function is made to check recurcively into tracks if element exist and cut them to fit the "black" spaces */
RenderP.prototype.findOnTrackB = function (tId, from, to, element) {
    console.log("trying ........");

    if (tId>=this.tabVideoTrack.length){ console.log("does not exist"); return false;}

    this.tabVideoTrack[tId].tabElements.sort(function (a, b) {
        return a.marginLeft - b.marginLeft
    });

    for (var e=0;e<this.tabVideoTrack[tId].tabElements.length;e++)
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
/* this function is made to convert multiple video tracks into single video track, by an analysis of present tracks */
RenderP.prototype.makeSingleVideoTrack = function(){

        this.tabVideoTrack[0].tabElements.sort(function (a, b) {
            console.log("tris");
            return a.marginLeft - b.marginLeft
        });
        //sort pour avoir les element dans le bon ordre des marges


        this.elementInTrack = this.tabVideoTrack[0].tabElements;

        console.log("track ", 0, "elementT", this.elementInTrack);

        for (var e = 0; e < this.elementInTrack.length; e++) {
            console.log("element n°", e);
            if (e == 0) {
                console.log("0 -> deb");
                if (this.elementInTrack[e].marginLeft >= oneSecond) {
                    if (this.tracks[0].type == TYPE.VIDEO)
                    {
                        this.findOnTrackB(1, 0,this.elementInTrack[e].marginLeft, this.elementInTrack[e] );
                    }
                }

                this.getBlack(this.tabVideoTrack[0],e);
            }
            else if (e == (this.elementInTrack.length - 1)) {
                console.log("length -1");
            }
            else {
                console.log("not -1");
                this.getBlack(this.tabVideoTrack[0], e);
            }
            console.log('End !!')
        }

        this.mergeTrack(1);
};
/* When elements on tracks are cut to fit, the "black" size , Elements still are in their respective tracks.
   This function get tracks content and add it to the first track.
 */
RenderP.prototype.mergeTrack = function (trackId) {
    console.log("---------------------------------------------------------------------");
    if (trackId<this.tabVideoTrack.length)
    {
        console.log("Merging tracks");
        for (var i=0;i<this.tabVideoTrack[trackId].tabElements.length;i++)
        {
            this.tabVideoTrack[0].tabElements.push(this.tabVideoTrack[trackId].tabElements[i]);
        }
        this.tabVideoTrack.remove(trackId);
    }
    console.log("---------------------------------------------------------------------");
};
