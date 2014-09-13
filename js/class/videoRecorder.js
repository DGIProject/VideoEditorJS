/**
 * Created by Guillaume on 05/08/14.
 */
VideoRecorder = function(videoId,canvasId,autostart,framesRate){
    //arg[0] -> frameRate
    //this.videoQuerySelector = videoElement;
   // this.canvasQuerySelector = canvasElement;
    this.autostart = autostart | true;
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext('2d');
    video = document.getElementById(videoId);
    this.images = []; // will save images from webcam
    this.frameRate = framesRate || 6; // number of images per second
    localMediaStream = null;
    this.numberImage = 0;
    this.OAjax = [];
    this.sendedImage = 0;
    this.st = 0
    var that = this;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia({video:true}, function(stream){
        video.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;

        if (that.autostart){that.startRecording();}

    }, this.onCameraFail);
};
VideoRecorder.prototype.onCameraSuccess = function(stream){
   // document.querySelector(this.videoQuerySelector).src = window.URL.createObjectURL(stream);

};
VideoRecorder.prototype.onCameraFail = function (e) {
    console.log('Camera did not work.', e);
};
VideoRecorder.prototype.startRecording = function(maxTime){
    var that = this;

    this.startTimeOut = window.setTimeout(function(){
        console.log('StartingRecording ... ')
        var time = Math.ceil(1000/that.frameRate);
        that.SnapInterval = window.setInterval(function(){
            if (localMediaStream) {
                console.log('ImageTaken')
                ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight,0,0,200,150);
                that.images.push(canvas.toDataURL('image/png'));
              //  that.sendImages(that.numberImage);
                that.numberImage++;
               // document.getElementById('sended').innerHTML = that.numberImage;
                console.log('ImageNumer '+that.numberImage);
            }
            else{
                console.log('NotTaken');
            }
        },time);
    },1000);

    if (maxTime)
    {
        console.log('maxTime set to ....')
        maxTimeTimeOut = window.setTimeout(function(){
            that.stopRecording();
        },maxTime);
    }

};
VideoRecorder.prototype.stopRecording = function(){
    clearTimeout(this.startTimeOut);
    clearInterval(this.SnapInterval);
    localMediaStream.stop();
};
VideoRecorder.prototype.getImages = function(){
    return this.images;
};
VideoRecorder.prototype.sendImages = function(i)
{
    if (i)
    {
        console.log('i');
        var that = this;

        if (window.XMLHttpRequest) this.OAjax[i] = new XMLHttpRequest();
        else if (window.ActiveXObject) this.OAjax[i] = new ActiveXObject('Microsoft.XMLHTTP');
        this.OAjax[i].open('POST', 'php/uploadVideoImages.php', true);
        this.OAjax[i].onreadystatechange = function() {
            if(that.OAjax[i].readyState == 4 && that.OAjax[i].status == 200) {
                console.log(that.OAjax[i].responseText);
                that.sendedImage++;
               // document.getElementById('sended').innerHTML = that.sendedImage + '/'+that.numberImage;
            }
        };

        this.OAjax[i].upload.onprogress = function(e) {
            var done = e.position || e.loaded,
                total = e.totalSize || e.total;

            console.log('Video upload Progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');

        };

        this.OAjax[i].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this.OAjax[i].send('image='+this.images[i]+'&it='+i);
        document.getElementById('st').innerHTML = that.st + '/'+that.numberImage;
        that.st++;
    }
    else{
        console.log('not i');
        if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
        else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
        OAjax.open('POST', 'php/uploadVideoImages.php', true);
        OAjax.onreadystatechange = function() {
            if(OAjax.readyState == 4 && OAjax.status == 200) {
                console.log(OAjax.responseText);
            }
        };

        OAjax.upload.onprogress = function(e) {
            var done = e.position || e.loaded,
                total = e.totalSize || e.total;

            console.log('Video upload Progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');

        };

        OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        OAjax.send('images='+JSON.stringify(this.images));
    }


}