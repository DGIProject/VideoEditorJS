/**
 * Created by Guillaume on 18/02/14.
 */

currentFileIteration = 0

Render = function (tabListElements, tabListFiles, tabListTextElements, tabListTracks) {
    this.Elements = tabListElements;
    this.Files = tabListFiles;
    this.TextElements = tabListTextElements;
    this.Tracks = tabListTracks;
    this.videoLenthPx = 0; //PX !!!
    this.videoDuration = 0 //Secondes !!

    this.inputFileData = null;

    this.filesToConcat = []
    commandList = [];
    currentFileIteration = 0
	var blackImageFile = new FileList(this.Files.length, 'Image', 0, 'Blackelement', 'png', null);
	this.Files.push(blackImageFile);
	this.blackElementId = this.Files.length-1;
	console.log(this.blackElementId);
    this.retrieveBlackImage();
    this.prepareElement();

}

Render.prototype.prepareElement = function () {
    var ElementIncrementMin = 100000000;
    var ElementIncrementMinId;
    for (i = 0; i < this.Elements.length; i++) {
        if (this.Elements[i].marginXpx < ElementIncrementMin) {
            ElementIncrementMinId = i;
            ElementIncrementMin = this.Elements[i].marginXpx
        }
    }
    console.log(ElementIncrementMin, ElementIncrementMinId);
    // traitement de tout les element de piste pour connaitre la durée maximale de la Video .
    var ElementEnd;
    for (i = 0; i < this.Elements.length; i++) {
        ElementEnd = this.Elements[i].marginXpx + this.Elements[i].length
        if (ElementEnd > this.videoLenthPx) {
            this.videoLenthPx = ElementEnd + 50
        }
    }

    //At this moment we have the lenth in px of the video so to have de duration we need to convert it ....

    var numberSecond = Math.floor(this.videoLenthPx / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberSecond * 1000);
    var timeStr = convertedTime.getHours() - 1 + ':' + convertedTime.getMinutes() + ':' + convertedTime.getSeconds();
    this.videoDuration = timeStr;

    // this.makeRenderCommandList();

    //So we have the duration of the student video

    // this.runCommand('-help');
    document.getElementById('renderText').innerHTML = "Convertion de l'élément " + parseInt(currentFileIteration + 1) + "/" + commandList.length
    document.getElementById('progressRender').style.width = parseInt(currentFileIteration + 1) / commandList.length * 100 + "%"

    $("#loadingDivConvert").modal('show');

    this.inputFileData = this.Files[currentFileIteration].data;
    // this.runCommand(commandList[currentFileIteration].command);
    //
    console.log(this)
    this.makeCommandTracks();

}
Render.prototype.runCommand = function (text) {
    running = true;
    var args = this.parseArguments(text);
    console.log(args);
    this.worker.postMessage({
        type: "command",
        arguments: args,
        files: [
            {
                "name": "fileInput",
                "data": this.inputFileData
            },
            {
                "name": "blackElement",
                "data": this.blackElementData
            }
        ]
    });
}
Render.prototype.runCommandForMakeFinal = function (text) {
    running = true;
    var args = this.parseArguments(text);
    console.log(args);
    this.worker.postMessage({
        type: "command",
        arguments: args,
        files: [
            {
                "name": "fileInput",
                "data": this.inputFileData
            }
        ]
    });
}
Render.prototype.parseArguments = function (text) {
    text = text.replace(/\s+/g, ' ');
    var args = [];
    // Allow double quotes to not split args.
    text.split('"').forEach(function (t, i) {
        t = t.trim();
        if ((i % 2) === 1) {
            args.push(t);
        } else {
            args = args.concat(t.split(" "));
        }
    });
    return args;
}
Render.prototype.makeTracksFile = function () {

    this.worker = new Worker("js/lib/worker.js");

    this.worker.onmessage = function (event) {
        var message = event.data;
        if (message.type == "ready") {
            isWorkerLoaded = true;
            renderVar.inputFileData = renderVar.Files[renderVar.listCommand[currentFileIteration].fileId].data;
            renderVar.runCommand(renderVar.listCommand[currentFileIteration].command)
            console.log("Starting Convertions");
        } else if (message.type == "stdout") {
            console.log(message.data);
            //outputElement.textContent += message.data + "\n";
        } else if (message.type == "start") {
            //outputElement.textContent = "Worker has received command\n";
        } else if (message.type == "done") {
            running = false;
            var buffers = message.data;
            if (buffers.length) {
                //outputElement.className = "closed";
            }
            buffers.forEach(function (file) {
                // filesElement.appendChild(getDownloadLink(file.data, file.name));
                //   new Blob([file.data]);
                renderVar.Elements[renderVar.listCommand[currentFileIteration].elementIdInTab].data = new Blob([file.data]);
                console.log(renderVar.Elements[renderVar.listCommand[currentFileIteration].elementIdInTab]);
                currentFileIteration++;
                if (currentFileIteration < renderVar.listCommand.length)
                {
                    console.log("on apelle le suivant !!!! on apelle l'id ", currentFileIteration);
                    renderVar.inputFileData = renderVar.Files[renderVar.listCommand[currentFileIteration].fileId].data;
                    renderVar.runCommand(renderVar.listCommand[currentFileIteration].command);
                }
                else
                {
                    console.log("Finit, nous allons donc générer l'ensemvle du fichier")
					
                }
            });
        }
    };


}
Render.prototype.makeCommandTracks = function () {
    // Elements
    this.listCommand = [];
    var px = 0;
    var continuer = 0;
    this.infoElements = [];
    var noncollee = 0, noncolleeTenS = 0;

    // Pour chaque piste
    for (trackIteration = 0; trackIteration < this.Tracks.length; trackIteration++) {
        trackElements = this.Tracks[trackIteration].elementsId;
        console.log('ELement de la piste: ', trackElements);
        noncollee = 0;
        noncolleeTenS = 0
        //Pour chaque element de la piste
        for (elementTrackIteration = 0; elementTrackIteration < trackElements.length; elementTrackIteration++) {
            currentElementIdFromTrack = trackElements[elementTrackIteration];
            currentElement = this.Elements[currentElementIdFromTrack];
            console.log("Current Element", currentElement)
            // On test si c'est pas le dernier element
            console.log("current ELement ID from track : ", currentElementIdFromTrack)

            if (elementTrackIteration + 1 < trackElements.length) {
                nextElementId = trackElements[elementTrackIteration + 1];
                nextElement = this.Elements[nextElementId];
                console.log("Element suivant ID: ", nextElementId, nextElement);

                startPosNextElement = nextElement.offset
                endPosCurrentElement = currentElement.offset + currentElement.length

                console.log("Position Element : Start next:", startPosNextElement, "End current : ", endPosCurrentElement)
                if (startPosNextElement == endPosCurrentElement) {
                    // Si les éléments sont collé ...
                    console.log("l'element collé !!! ");

                    var tempCommand = "-i fileInput -strict -2 -ss " + parseInt(currentElement.getStartTimeFromStartLenth()) + " -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4"
                    this.listCommand.push({command: tempCommand, fileId: currentElement.fileId, elementIdInTab: currentElementIdFromTrack});
                    this.infoElements.push({start: currentElement.offset, end: currentElement.offset + currentElement.length})

                }
                else {
                    // Si deux element ne sont pas colle
                    console.log("l'element non collé !!! ");
                    // on crée un element fictif qui va correcpondre a une image noire.
                    // 1) on calcule la longueur en pixel :

                    ecart = Math.abs(startPosNextElement - endPosCurrentElement);
                    durre = Math.ceil(ecart / oneSecond);

                    console.log("Il y a un ecart de ", ecart, " pixels soit ", durre, " secondes");

                    // on ajoute le fichier d'avant
                    var tempCommand = "-i fileInput -strict -2 -ss " + parseInt(currentElement.getStartTimeFromStartLenth()) + " -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4"
                    this.listCommand.push({command: tempCommand, fileId: currentElement.fileId, elementIdInTab: currentElementIdFromTrack});
                    this.infoElements.push({start: currentElement.offset, end: currentElement.offset + currentElement.length})

                    var numberofTenSBlackElement = durre/10;
                    var numberfullElement = Math.floor(numberofTenSBlackElement);
                    var restsecond = (numberofTenSBlackElement - numberfullElement) * 10;

                    console.log(" Nombre total d'éléement 10s = ", numberofTenSBlackElement, " Nombre full=", numberfullElement, "Nb sec resnatnte =", restsecond)

                    for (i = 0; i<numberfullElement;i++)
                    {
                        // Full element !!
                        var blackElement = new Elements(this.Elements.length, 'black' + noncolleeTenS + ".mp4", "00:00:10", null, trackIteration);
                        this.Elements.push(blackElement);

                        var tempCommand = "-i blackElement black" + noncolleeTenS + ".mp4"
                        this.listCommand.push({command: tempCommand, fileId: this.blackElementId , elementIdInTab: this.Elements[this.Elements.length - 1]});
                        this.infoElements.push({start: endPosCurrentElement+(i*oneSecond*10), end: endPosCurrentElement + blackElement.length, black: true})

                        noncolleeTenS++
                    }

                    // Secondes restante

                    var tempCalculator = new Date();
                    tempCalculator.setTime(restsecond * 1000);
                    var tempsFFmpeg = tempCalculator.getHours()-1+":"+tempCalculator.getMinutes()+":"+tempCalculator.getSeconds();
                    console.log("Calculated time", tempsFFmpeg)
                    var blackElement = new Elements(this.Elements.length, 'black' + noncolleeTenS + ".mp4", tempsFFmpeg, null, trackIteration);
                    this.Elements.push(blackElement);

                    console.log("Liste de tout les elements : ", this.Elements);

                    //On ajoute l'element noir ...

                    var tempCommand = "-i blackElement -t " + restsecond + " black" + noncolleeTenS + ".mp4"
                    this.listCommand.push({command: tempCommand, fileId: this.blackElementId , elementIdInTab: this.Elements[this.Elements.length - 1]});
                    this.infoElements.push({start: endPosCurrentElement+(numberfullElement*oneSecond*restsecond), end: endPosCurrentElement + blackElement.length, black: true})

                    noncollee++;
                    noncolleeTenS++;
                }

            }
            else {
                // cela veux dire que c'est le dernier !
                console.log("C'est le dernier avec Iteration ", elementTrackIteration);

                //Ajout des information pour générer les fichier qui correspondent
                var tempCommand = "-i fileInput -strict -2 -ss " + parseInt(currentElement.getStartTimeFromStartLenth()) + " -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4"
                this.listCommand.push({command: tempCommand, fileId: currentElement.fileId, elementIdInTab: currentElementIdFromTrack});
                this.infoElements.push({start: currentElement.offset, end: currentElement.offset + currentElement.length})

            }
        }

    }
    console.log(this.listCommand);
    console.log(this.infoElements);
    console.log(this.Elements);
    console.log("il y a ", noncollee, "element non collé");
    this.makeTracksFile();
    //commandList = listCommand;
}
Render.prototype.retrieveBlackImage = function () {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "vid/blackElementVid10S", true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response;
        if (arrayBuffer) {
            renderVar.blackElementData = new Uint8Array(arrayBuffer)
            renderVar.Files[renderVar.blackElementId].data = renderVar.blackElementData;
            console.log("ok DL VID")
        }
    };

    oReq.send(null);
}