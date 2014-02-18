/**
 * Created by Guillaume on 18/02/14.
 */

currentFileIteration = 0

Render = function(tabListElements,tabListFiles,tabListTextElements, tabListTracks)
{
    this.onProcessEnd ;
    this.Elements = tabListElements
    this.Files = tabListFiles;
    this.TextElements = tabListTextElements;
    this.Tracks = tabListTracks;
    this.videoLenthPx = 0; //PX !!!
    this.videoDuration = 0 //Secondes !!

    this.currentFileIteration =0;
    this.inputFileData = null;
    commandList = [];
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
                currentFileIteration++;
                if (currentFileIteration < this.commandList.length)
                {
                    this.inputFileData = this.Files[commandList[currentFileIteration].fileId].data;
                    this.runCommand(commandList[currentFileIteration].command);
                    console.log('File number'+currentFileIteration-1+"Has finished to be in mp4");
                    this.Elements[commandList[currentFileIteration].elementIdInTab].data = new Blob([file.data]);
                }

            });
        }
    };
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

    this.makeRenderCommandList();

    //So we have the duration of the student video

   // this.runCommand('-help');
    this.inputFileData = this.Files[currentFileIteration].data;
    this.runCommand(commandList[currentFileIteration].command);
    //
    console.log(this)

}
Render.prototype.makeRenderCommandList = function(){
    var listCommand = [];

    for (i=0;i<this.Elements.length;i++)
    {
        var tempCommand = "-i fileInput -strict -2 -ss "+ parseInt(this.Elements[i].getStartTimeFromStartLenth()) +" -t "+ parseInt(this.Elements[i].getDurationInSecondFromCurrentDuration() - this.Elements[i].startTime) +" "+this.Elements[i].id+".mp4"
        listCommand.push({command:tempCommand,id:this.Elements[i].fileId,elementIdInTab:i});
    }

    commandList = listCommand;
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
