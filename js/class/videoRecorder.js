/**
 * Created by Guillaume on 05/08/14.
 */
VideoRecorder = function(videoId,canvasId,sound,framesRate){
    //arg[0] -> frameRate
    //this.videoQuerySelector = videoElement;
   // this.canvasQuerySelector = canvasElement;
    this.sound = sound | false;

    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext('2d');
    video = document.getElementById(videoId);
    this.frameRate = framesRate || 6; // number of images per second
    localMediaStream = null;
    this.numberImage = 0;

    this.leftchannel = [];
    this.rightchannel = [];
    this.recorder = null;
    this.recording = false;
    this.recordingLength = 0;
    this.volume = null;
    this.audioInput = null;
    this.audioContext = null;
    this.context = null;

    var that = this;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia({video:true, audio:this.sound}, function(stream){
        video.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;

        if (that.sound){
            console.log('Audio Process');
            that.audioContext = window.AudioContext || window.webkitAudioContext;
            that.context = new that.audioContext();

            // creates a gain node
            that.volume = that.context.createGain();

            // creates an audio node from the microphone incoming stream
            that.audioInput = that.context.createMediaStreamSource(localMediaStream);

            // connect the stream to the gain node
            that.audioInput.connect(that.volume);

            /* From the spec: This value controls how frequently the audioprocess event is
             dispatched and how many sample-frames need to be processed each call.
             Lower values for buffer size will result in a lower (better) latency.
             Higher values will be necessary to avoid audio breakup and glitches */
             var bufferSize = 256;
            that.recorder = that.context.createScriptProcessor(bufferSize, 1, 1);

            that.recorder.onaudioprocess = function(e){
                if (that.recording)
                {
                    // we clone the samples
                    that.leftchannel.push (new Float32Array (e.inputBuffer.getChannelData (0)));
                    that.recordingLength += bufferSize;
                }

            };

            // we connect the recorder
            that.volume.connect (that.recorder);
            that.recorder.connect (that.context.destination);
        }


    }, this.onCameraFail);
};

VideoRecorder.prototype.mergeBuffers = function(channelBuffer, recordingLength){
    var result = new Float32Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++){
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
};

VideoRecorder.prototype.interleave = function(leftChannel, rightChannel){
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length; ){
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
};

VideoRecorder.prototype.writeUTFBytes = function(view, offset, string){
    var lng = string.length;
    for (var i = 0; i < lng; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

VideoRecorder.prototype.exportWave = function()
{
    // we flat the left and right channels down
    var leftBuffer = this.mergeBuffers ( this.leftchannel, this.recordingLength );
    var rightBuffer = leftBuffer;
// we interleave both channels together
    var interleaved = this.interleave ( leftBuffer, rightBuffer );

// create the buffer and view to create the .WAV file
    var buffer = new ArrayBuffer(44 + interleaved.length * 2);
    var view = new DataView(buffer);

// write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
// RIFF chunk descriptor
    this.writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + interleaved.length * 2, true);
    this.writeUTFBytes(view, 8, 'WAVE');
// FMT sub-chunk
    this.writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
// stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
// data sub-chunk
    this.writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

// write the PCM samples
    var lng = interleaved.length;
    var index = 44;
    var volume = 1;
    for (var i = 0; i < lng; i++){
        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
    }

// our final binary blob that we can hand off
    var blob = new Blob ( [ view ], { type : 'audio/wav' } );
    console.log('exportedWave');
    return blob;
};

VideoRecorder.prototype.onCameraFail = function (e) {
    console.log('Camera did not work.', e);
};
VideoRecorder.prototype.startRecording = function(){
    var that = this;
    this.recording =true;
    this.gif = new GIF({
        workers: 2,
        workerScript: 'js/lib/gif.worker.js',
        quality: 10,
        width: video.videoWidth ,
        height: video.videoHeight
    });

    this.gif.on('finished', function(blob) {
        console.log(URL.createObjectURL(blob));
    });

    this.gif.on('progress', function(p) {
        console.log(Math.round(p * 100)+'%');
    });
     console.log('StartingRecording ... ');
        var time = Math.ceil(1000/that.frameRate);
        that.SnapInterval = window.setInterval(function(){
            if (localMediaStream && that.recording) {
                ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight,0,0,320,240);
                that.gif.addFrame(ctx, {copy: true, delay: time})
            }
            else{
                console.log('NotTaken');
            }
        },time);

};
VideoRecorder.prototype.stopRecording = function(){
    clearInterval(this.SnapInterval);
    this.recording = false;
    this.audio = this.exportWave();
    console.log(URL.createObjectURL(this.audio));
    localMediaStream.stop();

    this.gif.render();
};
