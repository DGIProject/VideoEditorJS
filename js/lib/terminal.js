var DurationString;
var worker;
var sampleImageData;
var sampleVideoData;
var outputElement;
var filesElement;
var running = false;
var isWorkerLoaded = false;
var isSupported = (function () {
    return document.querySelector && window.URL && window.Worker;
})();

function isReady() {
    return !running && isWorkerLoaded && sampleImageData && sampleVideoData;
}

function startRunning() {
    //document.querySelector("#image-loader").style.visibility = "visible";
    outputElement.className = "";
    filesElement.innerHTML = "";
    running = true;
}

function parseArguments(text) {
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

function getDownloadLink(fileData, fileName) {
    if (fileName.match(/\.jpeg|\.gif|\.jpg|\.png/)) {
        var blob = new Blob([fileData]);
        var src = window.URL.createObjectURL(blob);
        var img = document.createElement('img');

        img.src = src;
        return img;
    }
    else {
        var a = document.createElement('a');
        a.download = fileName;
        var blob = new Blob([fileData]);
        var src = window.URL.createObjectURL(blob);
        a.href = src;
        a.textContent = 'Click here to download ' + fileName + "!";
        return a;
    }
}

function initWorker() {
    worker = new Worker("js/lib/worker.js");
    console.log('initialising Worker .........');
    worker.onmessage = function (event) {
        var message = event.data;
        console.log(message)
        if (message.type == "ready") {
            isWorkerLoaded = true;
        }
        else if (message.type == "stdout") {
            console.log(message.data);
            if (message.data.substring(0, 11) == "  Duration:" && actionWorker == "getDurationFile") {
                DurationString = message.data;
                tabListFiles[tabListFiles.length - 1].setDuration(DurationString.substring(11, DurationString.indexOf(',')).replace(' ', ''))
            }
            //outputElement.textContent += message.data + "\n";
        }
        else if (message.type == "start") {
            console.log("Worker has received command\n");
        }
        else if (message.type == "done") {
            running = false;
            if (message.action == "getDurationFile" && message.fileType == TYPE.VIDEO)
            {
                var fileContent = message.files[0].data;
                worker.postMessage({
                    type: "command",
                    arguments: parseArguments("-i fileInput -f image2 -vf scale=-1:50 -an -ss "+Math.floor(tabListFiles[tabListFiles.length - 1].getDurationInSecondFromDuration()/2)+" thumbnail.jpg"),
                    files: [
                        {
                            "name": "fileInput",
                            "data": fileContent
                        }
                    ],
                    fileType : message.fileType,
                    action : ["getThumbnail", tabListFiles[tabListFiles.length - 1].id]
                });
            }

            var buffers = message.data;
            if (buffers.length) {
                //outputElement.className = "closed";
            }
            buffers.forEach(function (file) {
                // filesElement.appendChild(getDownloadLink(file.data, file.name));
                if (message.action[0] == "getThumbnail") {
                    var blob = new Blob([file.data]);
                    tabListFiles[tabListFiles.length - 1].setThumbnailImage(window.URL.createObjectURL(new Blob([file.data])))
                    uploadThumbnail(message.action[1], blob)
                }
            });
            currentProject.loadModal('hide');
        }
    };
}