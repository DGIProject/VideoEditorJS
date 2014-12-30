
var worker;
var running = false;
var isWorkerLoaded = false;
var isSupported = (function() {
  return document.querySelector && window.URL && window.Worker;
})();

function isReady() {
  return !running && isWorkerLoaded && sampleImageData && sampleVideoData;
}

function startRunning() {
  running = true;
}
function stopRunning() {
  running = false;
}

function parseArguments(text) {
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


function runCommand(text) {
  if (isReady()) {
    startRunning();
    var args = parseArguments(text);
    console.log(args);
    worker.postMessage({
      type: "command",
      arguments: args,
      files: []
    });
  }
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
  worker = new Worker("ffmpegJs/demo/worker-asm.js");
  worker.onmessage = function (event) {
    var message = event.data;
    if (message.type == "ready") {
      isWorkerLoaded = true;
      worker.postMessage({
        type: "command",
        arguments: ["-help"]
      });
    } else if (message.type == "stdout") {
      console.log(message.data);
      //outputElement.textContent += message.data + "\n";
    } else if (message.type == "start") {
      console.log("Worker has received command\n");
    } else if (message.type == "done") {
      stopRunning();
      var buffers = message.data;
      if (buffers.length) {
      }
      buffers.forEach(function(file) {
        //console.log(getDownloadLink(file.data, file.name))
       // filesElement.appendChild(getDownloadLink(file.data, file.name));
        var blob = new Blob([file.data]);
        var src = window.URL.createObjectURL(blob);
        console.log(src);
      });
    }
  };
}

document.addEventListener("DOMContentLoaded", function() {

  initWorker();
});