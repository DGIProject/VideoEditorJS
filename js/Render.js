/**
 * Created by Guillaume on 18/02/14.
 */

currentFileIteration = 0

Render = function(tabListElements,tabListFiles,tabListTextElements, tabListTracks)
{
    this.Elements = tabListElements;
    this.Files = tabListFiles;
    this.TextElements = tabListTextElements;
    this.Tracks = tabListTracks;
    this.videoLenthPx = 0; //PX !!!
    this.videoDuration = 0 //Secondes !!

    this.currentFileIteration =0;
    this.inputFileData = null;
    this.blackImageData = this.retrieveBlackImage();
    this.filesToConcat = []
    commandList = [];

 //   this.worker = new Worker("js/lib/worker.js");

 /*   this.worker.onmessage = function (event) {
        var message = event.data;
        if (message.type == "ready") {
            isWorkerLoaded = true;
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
            buffers.forEach(function(file) {
                // filesElement.appendChild(getDownloadLink(file.data, file.name));
                //   new Blob([file.data]);
                console.log(this)
                currentFileIteration++;
                console.log('File number '+parseInt(currentFileIteration-1)+" Has finished to be in mp4");
                renderVar.Elements[commandList[parseInt(currentFileIteration-1)].elementIdInTab].data = new Blob([file.data]);
                document.getElementById('renderText').innerHTML = parseInt(currentFileIteration+1) + "/"+commandList.length
                document.getElementById('progressRender').style.width = parseInt(currentFileIteration+1)/commandList.length*100 + "px"

                if (currentFileIteration < this.commandList.length)
                {
                    renderVar.inputFileData = renderVar.Files[commandList[currentFileIteration].id].data;
                    renderVar.runCommand(commandList[currentFileIteration].command);

                }
                else
                {
                  renderVar.makeTracksFile();
                }

            });
        }
    };*/
    this.prepareElement();
}
Render.prototype.prepareElement = function()
{
    var ElementIncrementMin = 100000000;
    var ElementIncrementMinId;
    for (i = 0 ;i<this.Elements.length;i++)
    {
        if (this.Elements[i].marginXpx < ElementIncrementMin)
        {
            ElementIncrementMinId = i;
            ElementIncrementMin = this.Elements[i].marginXpx
        }
    }
    console.log(ElementIncrementMin,ElementIncrementMinId);
    // traitement de tout les element de piste pour connaitre la durée maximale de la Video .
    var ElementEnd;
    for (i = 0 ;i<this.Elements.length;i++)
    {
        ElementEnd = this.Elements[i].marginXpx + this.Elements[i].length
        if(ElementEnd > this.videoLenthPx)
        {
            this.videoLenthPx = ElementEnd + 50
        }
    }

    //At this moment we have the lenth in px of the video so to have de duration we need to convert it ....

    var numberSecond = Math.floor(this.videoLenthPx / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberSecond * 1000);
    var timeStr = convertedTime.getHours()-1+':'+convertedTime.getMinutes()+':'+convertedTime.getSeconds();
    this.videoDuration = timeStr;

   // this.makeRenderCommandList();

    //So we have the duration of the student video

   // this.runCommand('-help');
    document.getElementById('renderText').innerHTML ="Convertion de l'élément " + parseInt(currentFileIteration+1) + "/"+commandList.length
    document.getElementById('progressRender').style.width = parseInt(currentFileIteration+1)/commandList.length*100 + "%"

    $("#loadingDivConvert").modal('show');

    this.inputFileData = this.Files[currentFileIteration].data;
   // this.runCommand(commandList[currentFileIteration].command);
    //
    console.log(this)

}
Render.prototype.runCommand = function(text) {
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
Render.prototype.parseArguments = function(text) {
    text = text.replace(/\s+/g, ' ');
    var args = [];
    // Allow double quotes to not split args.
    text.split('"').forEach(function(t, i) {
        t = t.trim();
        if ((i % 2) === 1) {
            args.push(t);
        } else {
            args = args.concat(t.split(" "));
        }
    });
    return args;
}
Render.prototype.makeTracksFile = function()
{

    this.makeCommandTracks();

    this.worker = new Worker("js/lib/worker.js");

    this.worker.onmessage = function (event) {
        var message = event.data;
        if (message.type == "ready") {
            isWorkerLoaded = true;
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
            buffers.forEach(function(file) {
                // filesElement.appendChild(getDownloadLink(file.data, file.name));
                //   new Blob([file.data]);

            });
        }
    };


}
Render.prototype.makeCommandTracks = function()
{
    // Elements
    this.listCommand = [];
    var px = 0;
    var continuer = 0;
    this.infoElements = [];
    var noncollee = 0;

  /*  for (i=0;i<this.Tracks.length;i++)
    {
        for (y=0;y<this.Tracks[i].elementsId.length;y++)
        {
            if(y+1 >= this.Tracks[i].elementsId.length)
            {

            }
            else
            {
                var curentElement = this.Elements[this.Tracks[i].elementsId[y]].offset + this.Elements[this.Tracks[i].elementsId[y]].length;
                var afterElement = this.Elements[this.Tracks[i].elementsId[y+1]].offset ;

                console.log("current Element", curentElement)
                console.log("afterElement", afterElement)

                if (curentElement == afterElement)
                {
                  console.log("Collée au lélémoent d'apres...")
                    var tempCommand = "-i fileInput -strict -2 -ss "+ parseInt(this.Elements[this.Tracks[i].elementsId[y]].getStartTimeFromStartLenth()) +" -t "+ parseInt(this.Elements[i].getDurationInSecondFromCurrentDuration() - this.Elements[i].startTime) +" "+this.Elements[i].id+".mp4"
                    this.listCommand.push({command:tempCommand,fileId:this.Elements[this.Tracks[i].elementsId[y]].fileId,elementIdInTab:this.Tracks[i].elementsId[y]});
                    this.infoElements.push({start:this.Elements[this.Tracks[i].elementsId[y]].offset, end:this.Elements[this.Tracks[i].elementsId[y]].offset + this.Elements[this.Tracks[i].elementsId[y]].length})

                }
                else
                {

                    var espace  = afterElement - curentElement

                    var tempCommand = "-i fileInput -strict -2 -ss "+ parseInt(this.Elements[this.Tracks[i].elementsId[y]].getStartTimeFromStartLenth()) +" -t "+ parseInt(this.Elements[i].getDurationInSecondFromCurrentDuration() - this.Elements[i].startTime) +" "+this.Elements[i].id+".mp4"
                    this.listCommand.push({command:tempCommand,fileId:this.Elements[this.Tracks[i].elementsId[y]].fileId,elementIdInTab:this.Tracks[i].elementsId[y]});
                    this.infoElements.push({start:this.Elements[this.Tracks[i].elementsId[y]].offset, end:this.Elements[this.Tracks[i].elementsId[y]].offset + this.Elements[this.Tracks[i].elementsId[y]].length})

                    console.log("non Collé  !!!! Il y a un espace de ",espace," px soit ", Math.ceil(espace/oneSecond), "secondes");

                    var tempCommand = "-i blockImage -strict -2 -t "+ Math.ceil(espace/oneSecond) +" black"+noncollee+".mp4"

                    var blackElement = new Elements(this.Elements.length,'black'+noncollee+".mp4","00:00:00",null,i);
                    blackElement.resize(espace,this.Elements[this.Tracks[i].elementsId[y]].offset + this.Elements[this.Tracks[i].elementsId[y]].length);

                    this.Elements.push(blackElement);
                    console.log(this.Elements);

                    this.listCommand.push({command:tempCommand,fileId:this.Elements[this.Tracks[i].elementsId[y]].fileId,elementIdInTab:this.Tracks[i].elementsId[y]});
                    console.log('OK');
                    this.infoElements.push({start:this.Elements[this.Tracks[i].elementsId[y]].offset + this.Elements[this.Tracks[i].elementsId[y]].length, end:this.Elements[this.Tracks[i].elementsId[y]].offset + espace})


                    noncollee++;
                }
            }
        }

    } */

    // Pour chaque piste
    for (trackIteration = 0; trackIteration< this.Tracks.length; trackIteration++)
    {
       trackElements = this.Tracks[trackIteration].elementsId;
       console.log('ELement de la piste: ',trackElements);
       noncollee = 0;
       //Pour chaque element de la piste
        for (elementTrackIteration = 0 ; elementTrackIteration<trackElements.length;elementTrackIteration++)
        {
            currentElementIdFromTrack = trackElements[elementTrackIteration];
            currentElement = this.Elements[currentElementIdFromTrack];
            console.log("Current Element", currentElement)
            // On test si c'est pas le dernier element
            console.log("current ELement ID from track : ",currentElementIdFromTrack)

            if (elementTrackIteration+1 < trackElements.length)
            {
                nextElementId  = trackElements[elementTrackIteration+1];
                nextElement = this.Elements[nextElementId];
                console.log("Element suivant ID: ", nextElementId, nextElement);

                startPosNextElement = nextElement.offset
                endPosCurrentElement = currentElement.offset+currentElement.length

                console.log("Position Element : Start next:", startPosNextElement, "End current : ", endPosCurrentElement)
                if (startPosNextElement == endPosCurrentElement)
                {
                    // Si les éléments sont collé ...
                    console.log("l'element collé !!! ");

                    var tempCommand = "-i fileInput -strict -2 -ss "+ parseInt(currentElement.getStartTimeFromStartLenth()) +" -t "+ parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) +" "+currentElement.id+".mp4"
                    this.listCommand.push({command:tempCommand,fileId:currentElement.fileId,elementIdInTab:currentElementIdFromTrack});
                    this.infoElements.push({start:currentElement.offset, end:currentElement.offset + currentElement.length})

                }
                else
                {
                    // Si deux element ne sont pas colle
                    console.log("l'element non collé !!! ");
                    // on crée un element fictif qui va correcpondre a une image noire.
                    // 1) on calcule la longueur en pixel :

                    ecart = endPosCurrentElement - startPosNextElement
                    durre = Math.ceil(ecart/oneSecond);

                    console.log("Il y a un ecart de ", ecart," pixels soit ",durre, " secondes");

                    // on ajoute le fichier d'avant
                    var tempCommand = "-i fileInput -strict -2 -ss "+ parseInt(currentElement.getStartTimeFromStartLenth()) +" -t "+ parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) +" "+currentElement.id+".mp4"
                    this.listCommand.push({command:tempCommand,fileId:currentElement.fileId,elementIdInTab:currentElementIdFromTrack});
                    this.infoElements.push({start:currentElement.offset, end:currentElement.offset + currentElement.length})

                    var blackElement = new Elements(this.Elements.length,'black'+noncollee+".mp4","00:00:00",null,trackIteration);
                    blackElement.resize(ecart,endPosCurrentElement);

                    this.Elements.push(blackElement);
                    console.log("Liste de tout les elements : ",this.Elements);

                    //On ajoute l'element noir ...

                    var tempCommand = "-i blockImage -strict -2 -t "+ Math.ceil(ecart/oneSecond) +" black"+noncollee+".mp4"
                    this.listCommand.push({command:tempCommand,fileId:this.Elements[this.Elements.length-1].fileId,elementIdInTab:this.Elements[this.Elements.length-1]});
                    this.infoElements.push({start:endPosCurrentElement, end:endPosCurrentElement + blackElement.length})

                    noncollee++;
                }

            }
            else
            {
                // cela veux dire que c'est le dernier !
                console.log("C'est le dernier avec Iteration ", elementTrackIteration);

                //Ajout des information pour générer les fichier qui correspondent
                var tempCommand = "-i fileInput -strict -2 -ss "+ parseInt(currentElement.getStartTimeFromStartLenth()) +" -t "+ parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) +" "+currentElement.id+".mp4"
                this.listCommand.push({command:tempCommand,fileId:currentElement.fileId,elementIdInTab:currentElementIdFromTrack});
                this.infoElements.push({start:currentElement.offset, end:currentElement.offset + currentElement.length})

            }
        }

    }
    console.log(this.listCommand);
    console.log(this.infoElements);
    console.log(this.Elements);
    console.log("il y a ",noncollee,"element non collé");
    //commandList = listCommand;
}
Render.prototype.retrieveBlackImage = function() {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "img/blackElement.png", true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response;
        if (arrayBuffer) {
            this.blackImageData = new Uint8Array(arrayBuffer);
        }
    };

    oReq.send(null);
}