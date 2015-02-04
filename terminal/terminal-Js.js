/**
 * Created by Guillaume on 03/02/2015.
 */

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Terminal = function(){
    this.alias = {"ffmpeg" : "bin/ffmpeg.js", "list" : "bin/list.js", "gnuplot":"bin/gnuplot.js"};
    this.lastCommands = [];
    this.Workers = [];
    this.Files = [];
};
Terminal.prototype.exist = function(bin){
    var found = false;
    for(var key in this.alias)
    {
        console.log("-"+key);
        if (key===bin)
        {
            found = true;
            break;
        }
    }
    return found;
};
Terminal.prototype.processCmd = function(cmd){
    that = this;
    console.log(cmd, cmd.split(" ")[0]);
    if (this.exist(cmd.split(" ")[0]))
    {
        document.getElementById('returnInfo').innerHTML += "... <br/>";
        var workerId = this.GenerateWorkerId();
        this.Workers.push({ worker : new Worker(this.alias[cmd.split(" ")[0]]), id :workerId});
        this.lastCommands.push(cmd)
        this.startWorker(workerId, cmd.replace(cmd.split(" ")[0],'').trim());
    }
    else
    {
        document.getElementById('returnInfo').innerHTML += "Command not found <br/> Type <i>list</i> to have the list of available commands<br/>";
    }
};
Terminal.prototype.onWorkerMessage = function(e, index){
    console.log(e, "index" + index);
    var message = e.data;
    if (message.type == "stdout")
    {
        document.getElementById('returnInfo').innerHTML += message.text+"<br/>";
    }
    else if(message.type == "stop")
    {
        document.getElementById('returnInfo').innerHTML += "Executed in "+message.time+"ms<br/>";
        this.Workers[index].worker.terminate();
       // this.Workers.remove(index);
        if (message.hasOwnProperty("data"))
        {
            window.URL = window.URL || window.webkitURL;
            url = window.URL.createObjectURL(message.data);
            console.log("URL IS "+url);
        }
    }
};
Terminal.prototype.GenerateWorkerId = function(){
    if (this.Workers.length == 0)
    {
        return 0;
    }
    else
    {
        return this.Workers[this.Workers.length-1].id + 1;
    }
};
Terminal.prototype.startWorker = function(id, argv){
    var foundIndex = -1;
    for (i=0; i<this.Workers.length;i++)
    {
        if (this.Workers[i].id == id)
        {
            console.log(i, this.Workers[i]);
            foundIndex = i;
        }
    }

    that = this;

    if (foundIndex != -1) {
        this.Workers[foundIndex].worker.onmessage = function (e) {
            that.onWorkerMessage(e, foundIndex)
        };
        this.Workers[foundIndex].worker.postMessage({
            "id": that.Workers[foundIndex].id,
            "status": that.alias,
            "command": "start",
            "files" : that.Files,
            "argv" : argv
        });
    }
    else
    {
        console.log("cant't start ...")
    }
};
Terminal.prototype.loadFile = function(url, name){
    that = this;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response; // Note: not oReq.responseText
        if (arrayBuffer) {
            var byteArray = new Uint8Array(arrayBuffer);
            that.Files.push({data : byteArray, name: name})
            console.log("File"+name+" loaded !");
        }
        else
        {
            console.log("Unable to load file as ArrayBuffer");
        }
    };

    oReq.send(null);

};
