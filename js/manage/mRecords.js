/**
 * Created by Dylan on 10/02/2015.
 */

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+

var para = {audio: true, video: true};

var playElement;
var videoRecorderResult;

var audio = document.getElementById('audio');

var audioData = null;
var videoData = null;
var playPause = document.getElementById('playPauseRecordVideoButton');

var startRecordingbtn = document.getElementById('recordVideoButton');
var stopRecordingbtn = document.getElementById('stopRecordVideoButton');

function newRecord(type) {
    if(type == TYPE.VIDEO)
    {
        eId('audio').style.display = 'none';
        eId('video').style.display = '';

        para = {video: true, audio: true};
        console.log('vid !!')
        playElement = document.getElementById('video');
    }
    else
    {
        eId('video').style.display = 'none';
        eId('audio').style.display = '';

        console.log('audio !!')


        para = {video: false, audio: true};
        playElement = document.getElementById('audio');
    }

    eId('buttonSaveRecord').disabled = true;

    startRecordingbtn.disabled = false;
    playPause.disabled = true;
    stopRecordingbtn.disabled = true;

    $('#recordFileModal').modal('show');
}

document.getElementById('closeWaitRecordModal').onclick = function()
{
    $("#recordFileModal").modal('hide');
};


playPause.onclick = function() {
    if(playElement.played) {
        playElement.pause();
        document.getElementById('spanPlayPause').className = "glyphicon glyphicon-play";
    }
    else
    {
        playElement.play();
        document.getElementById('spanPlayPause').className = "glyphicon glyphicon-pause";
    }
};

function captureUserMedia(callback) {
    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    playPause.removeAttribute("disabled");
    navigator.getUserMedia(para, function (stream) {
        startRecordingbtn.disabled = true;
        stopRecordingbtn.disabled = false;
        playPause.disabled = true;
        playElement.muted = true;
        playElement.src = URL.createObjectURL(stream);
        localStream = stream;
        playElement.muted = true;
        playElement.play();
        callback(stream);
    }, function (error) {
        eId('RTCError').style.display = "";
        eId('RTCInfo').style.display = "none";
        console.error(error);
    });
}

startRecordingbtn.onclick = function () {

    eId('RTCError').style.display = "none";
    eId('RTCInfo').style.display = "";
    $("#waitRecordRTCModal").modal('show');
    console.log(para);
    captureUserMedia(function (stream) {
        $("#waitRecordRTCModal").modal('hide');
        if (isFirefox)
        {
            window.audioVideoRecorder = window.RecordRTC(stream, {
                type: 'video' // don't forget this; otherwise you'll get video/webm instead of audio/ogg
            });
        }

        if (isChrome) {

            if (para.video && para.audio)
            {
                window.audioVideoRecorder = window.RecordRTC(stream, {
                    type: 'video' // don't forget this; otherwise you'll get video/webm instead of audio/ogg
                });

                window.audioRecorder = window.RecordRTC(stream, {
                    type: 'audio' // don't forget this; otherwise you'll get video/webm instead of audio/ogg
                });
                window.audioRecorder.startRecording();
            }
            else{
                window.audioVideoRecorder = window.RecordRTC(stream);
            }

        }

        window.audioVideoRecorder.startRecording();
        countTimer = 0;
        timer = window.setInterval(function(){
            countTimer++;
            eId('durationVideoRecord').innerHTML =  secondToTime(countTimer);
        }, 1000);


    });
};
stopRecordingbtn.onclick = function () {
    stopRecordingbtn.disabled = true;
    startRecordingbtn.disabled = false;
    playPause.disabled = false;

    //recorder.getBlob(); // to get get a blob of what has been recorded ...
    window.audioVideoRecorder.stopRecording(function (url) {
        console.log(url);
        playElement.muted = false;
        playElement.src = url;
        clearInterval(timer);
        videoRecorderResult = window.audioVideoRecorder.getBlob();

        eId('buttonSaveRecord').style.display = '';
        eId('buttonSaveRecord').disabled = !(document.getElementById('fileName').value != '' && videoRecorderResult.size > 0);

        if (isChrome) {

            if (para.audio && para.video)
            {
                window.audioRecorder.stopRecording(function (url) {
                    console.log("audio " + url);
                    audio.src = url;
                    //video.play();
                });


                console.log("Les url sont " + document.getElementById('video').src + " et " + audio.src);


                var xhr = new XMLHttpRequest();
                xhr.open('GET', document.getElementById('video').src, true);

                xhr.responseType = 'arraybuffer';

                xhr.onload = function (e) {


                    videoData = new Uint8Array(this.response);

                    var xhra = new XMLHttpRequest();
                    xhra.open('GET', audio.src, true);

                    xhra.responseType = 'arraybuffer';

                    xhra.onload = function (e) {

                        audioData = new Uint8Array(this.response);
                        //console.log("Les data sont donc", audioData, "et vid : ", videoData);
                        $('#recordAudioOrVideoElement').modal('hide');
                        loadM();
                        var time = Date.now();

                        terminal.Files.push({name:"audio"+time, data: audioData});
                        terminal.Files.push({name:"video"+time, data: videoData});

                        terminal.processCmd("ffmpeg -i audio"+time+" -i video"+time+" -strict -2 -vcodec copy -acodec vorbis out.webm",function(e,index){
                            var message = e.data;
                            if (message.type == "stdout")
                            {
                                console.log(message.text);
                            }
                            else if(message.type == "stop") {
                                console.log("Executed in " + message.time + "ms");
                                terminal.Workers[index].worker.terminate();

                                if (message.hasOwnProperty("data"))
                                {
                                    window.URL = window.URL || window.webkitURL;
                                    var buffers = message.data;
                                    buffers.forEach(function (file) {
                                        console.log("Something traite avec le worker en provenance de videoRecorder")
                                        videoRecorderResult = new Blob([file.data]);
                                        document.getElementById('video').src = window.URL.createObjectURL(videoRecorderResult);
                                        $('#recordFileModal').modal('show');
                                    });
                                }
                            }
                        });
                    };

                    xhra.send();


                };

                xhr.send();
            }


        }

        localStream.stop();
    });

};
document.getElementById('buttonSaveRecord').onclick = function(){
    if (document.getElementById('fileName').value != "" && videoRecorderResult.size > 0)
    {
       /*
        document.getElementById('videoRecorderErrorText').style.display = 'none';
        $('#recordAudioOrVideoElement').modal('hide');*/



        var fileName = (document.getElementById('fileName').value+"."+videoRecorderResult.type.split('/')[1]).deleteAccent().replace(new RegExp(' ', 'g'), '_');
        console.log(fileName);

        var typeFile = getTypeFile(fileName);
        console.log(typeFile);

        var fileId = (currentProject.tabListFiles.length > 0) ? (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id + 1) : 0;

        var oReq = new XMLHttpRequest();
        oReq.open("GET",playElement.src , true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
            var arrayBuffer = oReq.response;
            if (arrayBuffer) {
                //loadM();

                if (videoRecorderResult.type.split('/')[0] == "video")
                {
                    console.log("This is a videoFile -> convert to avi/mp4");
                    var ElementData = new Uint8Array(arrayBuffer);
                    terminal.Files.push({name: fileName, data: ElementData});

                    var newFileName = document.getElementById('fileName').value + ".avi";

                    sLoadM();
                    
                    terminal.processCmd("ffmpeg -i "+fileName+" "+newFileName, function (e, index){
                        var message = e.data;

                        if (message.type == "stdout") {
                            console.log(message.text);
                        }
                        else if (message.type == "stop") {
                            console.log("Executed in " + message.time + "ms");
                            if (message.hasOwnProperty("data")) {
                                window.URL = window.URL || window.webkitURL;
                                var buffers = message.data;
                                buffers.forEach(function (file) {
                                    var blob = new Blob([file.data]);
                                    var audioUrl = URL.createObjectURL(blob);
                                    console.log("mp4 video -> ",audioUrl);

                                    var reader = new FileReader();
                                    reader.addEventListener("loadend", function() {
                                        $('#recordFileModal').modal('hide');
                                        currentProject.tabListFiles.push(new File(fileId, uId(), typeFile, blob.size, newFileName, newFileName.split('.').pop()));
                                        addFileList(fileId, newFileName, typeFile);
                                        sLoadM();
                                        uploadFile(fileId, uId(), newFileName, reader.result, typeFile, newFileName.split('.').pop().toUpperCase());
                                        fileProcessing(fileId, reader.result);
                                    });
                                    reader.readAsArrayBuffer(blob);

                                });
                            }

                            terminal.Workers[index].worker.terminate();
                        }
                    });
                }
                else
                {
                    currentProject.tabListFiles.push(new File(fileId, uId(), typeFile, videoRecorderResult.size, fileName, fileName.split('.').pop()));
                    addFileList(fileId, fileName, typeFile);
                    sLoadM();
                    uploadFile(fileId, uId(), fileName, videoRecorderResult, 'FILE', fileName.split('.').pop().toUpperCase());
                    $('#recordFileModal').modal('hide');
                    fileProcessing(fileId, arrayBuffer);
                }
            }
        };

        oReq.send(null);
    }
    else
    {
        document.getElementById('videoRecorderErrorText').style.display = '';

    }
};
document.getElementById('fileName').onkeyup = function(){
    if(videoRecorderResult) {
        eId('buttonSaveRecord').disabled = !(document.getElementById('fileName').value != '' && videoRecorderResult.size > 0);
    }
};