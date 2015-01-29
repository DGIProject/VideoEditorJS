var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+

var para = {audio: true, video: true};

var audio = document.getElementById('audio');

var audioData = null;
var videoData = null;
var playPause = document.getElementById('playPauseRecordVideoButton');
playPause.disabled = true;
var startRecordingbtn = document.getElementById('recordVideoButton');
var stopRecordingbtn = document.getElementById('stopRecordVideoButton');

playPause.onclick = function()
{

    if(document.getElementById('video').paused) {
        document.getElementById('video').play();
        document.getElementById('spanPlayPause').className = "glyphicon glyphicon-play";
    }
    else
    {
        document.getElementById('video').pause();
        document.getElementById('spanPlayPause').className = "glyphicon glyphicon-pause";
    }


}


function captureUserMedia(callback) {
    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    playPause.removeAttribute("disabled");
    navigator.getUserMedia(para, function (stream) {
        video.src = URL.createObjectURL(stream);
        localStream = stream;
        video.muted = true;
        video.play();
        callback(stream);
    }, function (error) {
        console.error(error);
    });
}
startRecordingbtn.onclick = function () {
    startRecordingbtn.disabled = true;
    stopRecordingbtn.disabled = false;
    playPause.disabled = true;

    console.log(para);
    captureUserMedia(function (stream) {

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


    });
};
stopRecordingbtn.onclick = function () {

    document.getElementById('saveRecordButton').style.display = '';

    stopRecordingbtn.disabled = true;
    startRecordingbtn.removeAttribute("disabled");
    playPause.removeAttribute("disabled");
    //recorder.getBlob(); // to get get a blob of what has been recorded ...
    window.audioVideoRecorder.stopRecording(function (url) {
        console.log(url);
        document.getElementById('video').src = url;
       // video.muted = false;
        videoRecorderResult = window.audioVideoRecorder.getBlob();

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
                        currentProject.loadModal('show');

                        worker.postMessage({
                            type: "command",
                            arguments: parseArguments("-i audio -i video -strict -2 -vcodec copy -acodec vorbis out.webm"),
                            files: [
                                {
                                    "name": "audio",
                                    "data": audioData
                                },
                                {
                                    "name": "video",
                                    "data": videoData
                                }
                            ],
                            action : "VideoRecorder"
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
document.getElementById('saveRecordButton').onclick = function()
{
    if (document.getElementById('fileName').value != "" && videoRecorderResult.size > 0)
    {
        addFile({
                fileName : document.getElementById('fileName').value+".webm",
                data : videoRecorderResult,
                dataURL : document.getElementById('video').src
        });


        document.getElementById('videoRecorderErrorText').style.display = 'none';
        $('#recordAudioOrVideoElement').modal('hide');

    }
    else
    {
        document.getElementById('videoRecorderErrorText').style.display = '';

    }
};