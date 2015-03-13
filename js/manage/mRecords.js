/**
 * Created by Dylan on 10/02/2015.
 */

function newRecord() {
    document.getElementById('chooseRecordButtons').style.display = '';
    document.getElementById('videoRecord').style.display = 'none';
    document.getElementById('saveRecordButton').style.display = 'none';
    document.getElementById('saveRecordButton').setAttribute('disabled', '');

    $('#recordAudioOrVideoElement').modal('show');
}

function chooseAudioVideoRecord(audioa){

    audio.style.display = "none";
    para = {video:true, audio:true};
    if (audioa)
    {
        para = {video:false,audio:true};
        video = document.getElementById('audio');
        audio.style.display = '';
    }
    document.getElementById('video').style.display = '';
    document.getElementById('chooseRecordButtons').style.display = 'none';
    document.getElementById('videoRecord').style.display = '';

    startRecordingbtn.disabled = false;
    stopRecordingbtn.disabled = true;
}