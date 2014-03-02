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
    //this.blackImageData = this.retrieveBlackImage();
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

    for (i=0;i<this.Tracks.length;i++)
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

                    this.listCommand.push({command:tempCommand,fileId:this.Elements[this.Tracks[i].elementsId[y]].fileId,elementIdInTab:this.Tracks[i].elementsId[y]});
                    this.infoElements.push({start:this.Elements[this.Tracks[i].elementsId[y]].offset + this.Elements[this.Tracks[i].elementsId[y]].length, end:this.Elements[this.Tracks[i].elementsId[y]].offset + espace})


                    noncollee++;
                }
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
    oReq.open("GET", "blackElement.png", true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response;
        if (arrayBuffer) {
            this.blackImageData = new Uint8Array(arrayBuffer);
        }
    };

    oReq.send(null);
}