/**
 * Created by Dylan on 10/02/2015.
 */

function newRecord(type) {
    if(type == TYPE.VIDEO)
    {
        eId('audioRecord').style.display = 'none';
        eId('videoRecord').style.display = 'initial';

        para = {video:true, audio:true};
    }
    else
    {
        eId('videoRecord').style.display = 'none';
        eId('audioRecord').style.display = 'initial';

        para = {video:false,audio:true};
    }
    
    eId('buttonSaveRecord').disabled = true;

    startRecordingbtn.disabled = false;
    stopRecordingbtn.disabled = true;

    $('#recordFileModal').modal('show');
}