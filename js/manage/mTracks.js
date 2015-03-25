/**
 * Created by Dylan on 10/02/2015.
 */

var oneSecond = 5;
var pixelTimeBar = {g: 0, d: 710};
var lastZoom = 5;
var scrollTracks = 0;

function addTrack() {
    var idTrack1 = (currentProject.tabListTracks.length > 0) ? (currentProject.tabListTracks[currentProject.tabListTracks.length - 1].id + 1) : 0;
    var idTrack2 = idTrack1 + 1;

    var videoInfo = document.createElement('div');
    videoInfo.id = 'videoInfo' + idTrack1;
    videoInfo.classList.add('singleTrack');
    videoInfo.innerHTML = '<div class="valuesTrack"><span class="bold">VIDEO ' + idTrack1 + '</span></div><div class="optionsTrack"><button type="button" onclick="deleteTrackModal(' + idTrack1 + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';

    var videoView = document.createElement('canvas');
    videoView.id = 'videoView' + idTrack1;
    videoView.classList.add('singleTrack');

    videoView.onmousedown = mouseDown;
    videoView.onmousemove = mouseMove;

    videoView.ondragover = allowDrop;
    videoView.ondrop = dropFile;

    videoView.oncontextmenu = showContextMenu;

    videoView.width = 730;
    videoView.height = 120;

    var contextVideoView = videoView.getContext('2d');
    contextVideoView.width = 730;
    contextVideoView.height = 120;

    document.getElementById('videoInfo').appendChild(videoInfo);
    document.getElementById('videoView').appendChild(videoView);

    currentProject.tabListTracks.push(new Track(idTrack1, TYPE.VIDEO, {element: videoView, context: contextVideoView}, idTrack2));

    drawElements(currentProject.tabListTracks.length - 1);

    var audioInfo = document.createElement('div');
    audioInfo.id = 'audioInfo' + idTrack2;
    audioInfo.classList.add('singleTrack');
    audioInfo.innerHTML = '<div class="valuesTrack"><span class="bold">AUDIO ' + idTrack2 + '</span></div><div class="optionsTrack"><button type="button" onclick="deleteTrackModal(' + idTrack2 + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';

    var audioView = document.createElement('canvas');
    audioView.id = 'audioView' + idTrack2;
    audioView.classList.add('singleTrack');

    audioView.onmousedown = mouseDown;
    audioView.onmousemove = mouseMove;

    audioView.ondragover = allowDrop;
    audioView.ondrop = dropFile;

    audioView.oncontextmenu = showContextMenu;

    audioView.width = 730;
    audioView.height = 120;

    var contextAudioView = audioView.getContext('2d');
    contextAudioView.width = 730;
    contextAudioView.height = 120;

    document.getElementById('audioInfo').appendChild(audioInfo);
    document.getElementById('audioView').appendChild(audioView);

    currentProject.tabListTracks.push(new Track(idTrack2, TYPE.AUDIO, {element: audioView, context: contextAudioView}, idTrack1));

    drawElements(currentProject.tabListTracks.length - 1);
}

function deleteTrackModal(id) {

    if (currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)].parent != -1)
    {
        var parentTrack = currentProject.tabListTracks[rowById(currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)].parent, currentProject.tabListTracks)];

        document.getElementById('parentTrack').innerHTML = ((parentTrack.type == TYPE.VIDEO) ? 'VIDEO' : 'AUDIO') + ' ' + parentTrack.id;
        document.getElementById('haveParentTrack').style.display = 'initial';
    }
    else
    {
        document.getElementById('haveParentTrack').style.display = 'none';
    }

    document.getElementById('buttonDeleteTrack').setAttribute('onclick', 'deleteTrack(' + id + ');');

    $('#deleteTrackModal').modal('show');
}

function deleteTrack(id) {
    rLog('-DELETE TRACK- id : ' + id);

    $('#deleteTrackModal').modal('hide');

    var rowTrack1 = rowById(id, currentProject.tabListTracks);

    var videoInfo = document.getElementById('videoInfo');
    var videoView = document.getElementById('videoView');

    var audioInfo = document.getElementById('audioInfo');
    var audioView = document.getElementById('audioView');

    if(currentProject.tabListTracks[rowTrack1].type == TYPE.VIDEO)
    {
        videoInfo.removeChild(document.getElementById('videoInfo' + id));
        videoView.removeChild(document.getElementById('videoView' + id));
    }
    else
    {
        audioInfo.removeChild(document.getElementById('audioInfo' + id));
        audioView.removeChild(document.getElementById('audioView' + id));
    }

    rLog('-DELETE TRACK- parent : ' + currentProject.tabListTracks[rowTrack1].parent);

    if (currentProject.tabListTracks[rowTrack1].parent >= 0)
    {
        var row2 = rowById(currentProject.tabListTracks[rowTrack1].parent, currentProject.tabListTracks);

        currentProject.tabListTracks[row2].parent = -1;

        if (eId('radioDeleteY').checked)
            deleteTrack(currentProject.tabListTracks[row2].id);
    }

    currentProject.tabListTracks.remove(rowTrack1);
}

//ZOOM
function changeZoom(zoom, defaultZ) {
    document.getElementById('zoomRange').value = zoom;

    lastZoom = (defaultZ) ? zoom : oneSecond;
    oneSecond = zoom;

    calculateTimeBar();
    calculateElementsPixel();

    console.log(oneSecond);
}

function zoomPlus() {
    if (parseInt(document.getElementById('zoomRange').value) < 10) {

        lastZoom = oneSecond;
        oneSecond = parseInt(document.getElementById('zoomRange').value) + 1;

        document.getElementById('zoomRange').value = oneSecond;

        calculateTimeBar();
        calculateElementsPixel();
    }

    console.log(oneSecond);
}

function zoomMoins() {
    if (parseInt(document.getElementById('zoomRange').value) > 1) {

        lastZoom = oneSecond;
        oneSecond = parseInt(document.getElementById('zoomRange').value) - 1;

        document.getElementById('zoomRange').value = oneSecond;

        calculateTimeBar();
        calculateElementsPixel();
    }

    console.log(oneSecond);
}

function calculateElementsPixel() {
    for(var i = 0; i < currentProject.tabListTracks.length; i++)
    {
        for(var x = 0; x < currentProject.tabListTracks[i].tabElements.length; x++)
        {
            var element = currentProject.tabListTracks[i].tabElements[x];

            element.width = (element.width / lastZoom) * oneSecond;
            element.minWidth = (element.minWidth / lastZoom) * oneSecond;
            element.maxWidth = (element.maxWidth / lastZoom) * oneSecond;

            element.marginLeft = (element.marginLeft / lastZoom) * oneSecond;
        }

        drawElements(i);
    }
}


//SCROLL
function scrollPlusTracks() {
    currentProject.tabListTracks[0].canvas.element.width += 10;
    currentProject.tabListTracks[0].canvas.context.width += 10;

    for(var i = 1; i < currentProject.tabListTracks.length; i++)
    {
        currentProject.tabListTracks[i].canvas.element.width = currentProject.tabListTracks[0].canvas.element.width;
        currentProject.tabListTracks[i].canvas.context.width = currentProject.tabListTracks[0].canvas.context.width;
    }
}

function scrollLessTracks() {
    if(currentProject.tabListTracks[0].canvas.element.width > 730)
    {
        currentProject.tabListTracks[0].canvas.element.width -= 10;
        currentProject.tabListTracks[0].canvas.context.width -= 10;

        for(var i = 0; i < currentProject.tabListTracks.length; i++)
        {
            if(currentProject.tabListTracks[i].canvas.element.width > 730)
            {
                currentProject.tabListTracks[i].canvas.element.width = currentProject.tabListTracks[0].canvas.element.width;
                currentProject.tabListTracks[i].canvas.context.width = currentProject.tabListTracks[0].canvas.context.width;
            }
        }
    }
}


//TIME BAR
function calculateTimeBar() {
    var timeGauche = Math.floor(pixelTimeBar.g / oneSecond);
    var timeDroit = Math.floor(pixelTimeBar.d / oneSecond);
    //console.log(timeDroit, timeGauche);
    // calcule du temp a droite !
    var heure = Math.floor(timeDroit / 3600)
    timeDroit = timeDroit - (3600 * heure);
    var minutes = Math.floor(timeDroit / 60)
    timeDroit = timeDroit - (60 * minutes);
    var seconde = timeDroit
    document.getElementById('endTime').innerHTML = heure + 'h' + minutes + "m" + seconde + "s";
    var heure = Math.floor(timeGauche / 3600)
    timeGauche = timeGauche - (3600 * heure);
    var minutes = Math.floor(timeGauche / 60)
    timeGauche = timeGauche - (60 * minutes);
    var seconde = timeGauche
    document.getElementById('startTime').innerHTML = heure + 'h' + minutes + "m" + seconde + "s";
}

//DROP ELEMENT
function allowDrop(e) {
    if(isFirefox)
    {
        console.log('isFirefox');

        var id = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
        var fileId = parseInt(e.dataTransfer.getData('fileId'));

        var track = currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)];
        var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

        if((file.isVideo && track.type == TYPE.VIDEO) || (file.isAudio && track.type == TYPE.AUDIO))
        {
            e.preventDefault();
        }
        else
        {
            console.log('no');
        }
    }
    else
    {
        e.preventDefault();
    }
}

function dropFile(e) {
    console.log('dropFile');

    e.preventDefault();

    var id = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var fileId = parseInt(e.dataTransfer.getData('fileId'));

    console.log(e.dataTransfer);
    console.log(fileId);

    var track = currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)];
    var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

    if((file.isVideo && track.type == TYPE.VIDEO) || (file.isAudio && track.type == TYPE.AUDIO))
    {
        console.log('yes');

        addElement(fileId, id, undefined, 0, true);
    }
    else
    {
        console.log('no');
    }
}

//RIGHT CLICK
function showContextMenu(e) {
    var trackId = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var rowTrack = rowById(trackId, currentProject.tabListTracks);

    var track = currentProject.tabListTracks[rowTrack];

    if(track.currentRow >= 0)
    {
        var element = track.tabElements[track.currentRow];
        var file = currentProject.tabListFiles[rowById(element.fileId, currentProject.tabListFiles)].fileName;

        eId('contextMenu').style.left = ((document.body.scrollLeft + e.clientX) - $('#globalEdit').offset().left) + 'px';
        eId('contextMenu').style.top = ((document.body.scrollTop + e.clientY) - $('#globalEdit').offset().top) + 'px';

        if(element.parent >= 0)
        {
            eId('buttonBreakLinkCM').setAttribute('onclick', 'breakLinkElements(' + element.id + ', ' + trackId + ');');
            eId('buttonBreakLinkClassCM').classList.remove('disabled');
        }
        else
        {
            eId('buttonBreakLinkCM').removeAttribute('onclick');
            eId('buttonBreakLinkClassCM').classList.add('disabled');
        }

        eId('buttonPropertiesCM').setAttribute('onclick', 'elementProperties(' + rowTrack + ',' + track.currentRow + ');');
        eId('buttonDeleteCM').setAttribute('onclick', 'deleteElement(' + rowTrack + ',' + track.currentRow + ');');

        //eId('buttonEffectsCM').disabled = true;
        eId('buttonOpacityCM').disabled = true;

        if(track.type == TYPE.AUDIO)
        {
            eId('buttonVolumeCM').setAttribute('onclick', 'volumeElementModal(' + element.id + ',' + trackId + ',\'' + file.fileName + '\');');
        }
        else
        {
            eId('buttonVolumeCM').disabled = true;
        }

        eId('contextMenu').style.display = 'initial';
    }

    return false;
}

function hideContextMenu() {
    eId('contextMenu').style.display = 'none';
}