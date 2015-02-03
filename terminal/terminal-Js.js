/**
 * Created by Guillaume on 03/02/2015.
 */

Terminal = function(){
    this.alias = {"ffmpeg" : "ffmpeg.js", "list" : "bin/list.js"}
    this.lastCommands = [];
    this.Workers = [];
}
Terminal.prototype.exist = function(bin){
    var found = false;
    for(var key in this.alias)
    {
        console.log(key);
        found = (key==bin)
    }
    return found;
}
Terminal.prototype.processCmd = function(cmd)
{
    that = this;
    console.log(cmd);
    if (this.exist(cmd.split(" ")[0]))
    {
        document.getElementById('returnInfo').innerHTML += "... <br/>";
        var workerId = this.GenerateWorkerId();
        this.Workers.push({ worker : new Worker(this.alias[cmd.split(" ")[0]]), id :workerId});
        this.lastCommands.push(cmd)
        this.startWorker(workerId);
    }
    else
    {
        document.getElementById('returnInfo').innerHTML += "Command not found <br/> Type <i>list</i> to have the list of available commands<br/>";
    }
}

Terminal.prototype.onWorkerMessage = function(e, index){
    console.log(e, "index" + index);
    var message = e.data;
    if (message.type == "out")
    {
        document.getElementById('returnInfo').innerHTML += message.text+"<br/>";
    }
    else if(message.type == "stop")
    {
        document.getElementById('returnInfo').innerHTML += "Executed in "+message.time+"ms<br/>";
        this.Workers[index].terminate();
        this.Workers.splice(index, 1);
    }
}
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
Terminal.prototype.startWorker = function(id){
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
            "command": "start"
        });
    }
    else
    {
        console.log("cant't start ...")
    }
}
