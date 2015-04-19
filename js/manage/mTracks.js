/**
 * Created by Dylan on 10/02/2015.
 */

var oneSecond = 5;
var pixelTimeBar = {g: 0, d: 710};
var lastZoom = 5;
var scrollTracks = 0;

function addTracks() {
    var id1 = addTrack(TYPE.VIDEO);
    var id2 = addTrack(TYPE.AUDIO);

    setParentTracks(id1, id2);
}

function addTrack(type) {
    var trackId = (currentProject.tabListTracks.length > 0) ? (currentProject.tabListTracks[currentProject.tabListTracks.length - 1].id + 1) : 0;

    var elementInfo = document.createElement('div');
    elementInfo.id = 'elementInfo' + trackId;
    elementInfo.classList.add('singleTrack');
    elementInfo.innerHTML = '<div class="valuesTrack"><span class="bold">' + ((type == TYPE.VIDEO) ? 'VIDEO' : 'AUDIO') + ' ' + trackId + '</span></div><div class="optionsTrack"><button type="button" onclick="deleteTrackModal(' + trackId + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
    elementInfo.innerHTML = '<div class="valuesTrack"><span class="bold">' + ((type == TYPE.VIDEO) ? 'VIDEO' : 'AUDIO') + ' ' + trackId + '</span></div><div class="optionsTrack"><button type="button" onclick="deleteTrackModal(' + trackId + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';

    var elementView = document.createElement('canvas');
    elementView.id = 'elementView' + trackId;
    elementView.classList.add('singleTrack');

    elementView.onmousedown = mouseDownTracks;

    elementView.ondragover = allowDrop;
    elementView.ondrop = dropFile;

    elementView.oncontextmenu = showContextMenu;

    elementView.width = 730;
    elementView.height = 120;

    var contextElementView = elementView.getContext('2d');
    contextElementView.width = 730;
    contextElementView.height = 120;

    document.getElementById((type == TYPE.VIDEO) ? 'videoInfo' : 'audioInfo').appendChild(elementInfo);
    document.getElementById((type == TYPE.VIDEO) ? 'videoView' : 'audioView').appendChild(elementView);

    currentProject.tabListTracks.push(new Track(trackId, type, {element: elementView, context: contextElementView}));

    drawElements(currentProject.tabListTracks.length - 1);

    return trackId;
}

function setParentTracks(id1, id2) {
    currentProject.tabListTracks[rowById(id1, currentProject.tabListTracks)].setParent(id2);
    currentProject.tabListTracks[rowById(id2, currentProject.tabListTracks)].setParent(id1);
}

function deleteTrackModal(id) {
    if (currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)].parent != -1)
    {
        var parentTrack = currentProject.tabListTracks[rowById(currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)].parent, currentProject.tabListTracks)];

        document.getElementById('parentTrack').innerHTML = ((parentTrack.type == TYPE.VIDEO) ? 'VIDEO' : 'AUDIO') + ' ' + parentTrack.id;

        document.getElementById('labelDeleteY').classList.add('active');
        document.getElementById('radioDeleteY').checked = true;

        document.getElementById('labelDeleteN').classList.remove('active');
        document.getElementById('radioDeleteN').checked = false;

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
    rLog('-TRACK- delete|id : ' + id);

    $('#deleteTrackModal').modal('hide');

    var rowTrack1 = rowById(id, currentProject.tabListTracks);

    deleteGraphicalTrack(rowTrack1, id);

    rLog('-TRACK- delete|parent : ' + currentProject.tabListTracks[rowTrack1].parent);

    for(var i = 0; i < currentProject.tabListTracks[rowTrack1].tabElements.length; i++) {
        breakLinkElements(currentProject.tabListTracks[rowTrack1].tabElements[i].id, id);
    }

    if (currentProject.tabListTracks[rowTrack1].parent >= 0)
    {
        var rowTrack2 = rowById(currentProject.tabListTracks[rowTrack1].parent, currentProject.tabListTracks);

        currentProject.tabListTracks[rowTrack2].parent = -1;

        if(eId('radioDeleteY').checked)
        {
            deleteGraphicalTrack(rowTrack2, currentProject.tabListTracks[rowTrack2].id);

            currentProject.tabListTracks.splice(rowTrack2, 1);
        }
    }

    currentProject.tabListTracks.splice(rowById(id, currentProject.tabListTracks), 1);
}

function deleteGraphicalTrack(row, id) {
    if(currentProject.tabListTracks[row].type == TYPE.VIDEO)
    {
        document.getElementById('videoInfo').removeChild(document.getElementById('elementInfo' + id));
        document.getElementById('videoView').removeChild(document.getElementById('elementView' + id));
    }
    else
    {
        document.getElementById('audioInfo').removeChild(document.getElementById('elementInfo' + id));
        document.getElementById('audioView').removeChild(document.getElementById('elementView' + id));
    }
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
    if (parseInt(document.getElementById('zoomRange').value) < parseInt(document.getElementById('zoomRange').max)) {

        lastZoom = oneSecond;
        oneSecond = parseInt(document.getElementById('zoomRange').value) + 1;

        document.getElementById('zoomRange').value = oneSecond;

        calculateTimeBar();
        calculateElementsPixel();
    }

    console.log(oneSecond);
}

function zoomMoins() {
    if (parseInt(document.getElementById('zoomRange').value) > parseInt(document.getElementById('zoomRange').min)) {

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

    canvas = document.getElementById('timeBarCanvas');
    ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    var text = pixelToTime(pixelTimeBar.g);
    ctx.font = "10pt Verdana";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    var textPxLength = ctx.measureText(text);
    ctx.fillStyle = "#000000";
    ctx.fillText(text,0,3);

    text = pixelToTime(pixelTimeBar.d);
    ctx.font = "10pt Verdana";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    textPxLength = ctx.measureText(text);
    ctx.fillStyle = "#000000";
    ctx.fillText(text,(canvas.width-textPxLength.width),3);

    /*console.log(timeDroit, timeGauche);
    calcule du temp a droite !

    var heure = Math.floor(timeDroit / 3600);
    timeDroit = timeDroit - (3600 * heure);
    var minutes = Math.floor(timeDroit / 60);
    timeDroit = timeDroit - (60 * minutes);
    var seconde = timeDroit;
    var text = heure + 'h' + minutes + "m" + seconde + "s";
    document.getElementById('endTime').innerHTML = text ;


    var heure = Math.floor(timeGauche / 3600);
    timeGauche = timeGauche - (3600 * heure);
    var minutes = Math.floor(timeGauche / 60);
    timeGauche = timeGauche - (60 * minutes);
    var seconde = timeGauche;
    text = heure + 'h' + minutes + "m" + seconde + "s"
    document.getElementById('startTime').innerHTML = text;*/
}
function mouseMoveTime(e){
    calculateTimeBar();
    var canvas = document.getElementById('timeBarCanvas');
    var rect = canvas.getBoundingClientRect();
    ctx = canvas.getContext('2d');
    var x = e.clientX - rect.left, y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x,canvas.height/2);
    ctx.lineTo(x,canvas.height);
    ctx.closePath();
    ctx.stroke();

    var text = pixelToTime(x);
    ctx.font = "10pt Verdana";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var textPxLength = ctx.measureText(text);
    //console.log(textPxLength);
    ctx.fillStyle = "#000000";
    ctx.fillText(text,x,3);
}

//DROP ELEMENT
function allowDrop(e) {
    if(isFirefox)
    {
        console.log('isFirefox');

        var id = parseInt(this.id.replace('elementView', ''));
        var fileId = parseInt(e.dataTransfer.getData('fileId'));

        var track = currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)];
        var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

        if(file.isVideo && file.isAudio)
        {
            if(track.parent >= 0)
            {
                console.log('yes because have parent');

                e.preventDefault();
            }
            else
            {
                console.log('no parent');
            }
        }
        else if((file.isVideo && track.type == TYPE.VIDEO) || (file.isAudio && track.type == TYPE.AUDIO))
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

    var id = parseInt(this.id.replace('elementView', ''));
    var fileId = parseInt(e.dataTransfer.getData('fileId'));

    console.log(e.dataTransfer);
    console.log(fileId);

    var track = currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)];
    var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

    if(file.isVideo && file.isAudio)
    {
        if(track.parent >= 0)
        {
            console.log('yes because have parent');

            addElementTrack(fileId, id, -1, 0, -1, true);
        }
        else
        {
            console.log('no parent');
        }
    }
    else if((file.isVideo && track.type == TYPE.VIDEO) || (file.isAudio && track.type == TYPE.AUDIO))
    {
        console.log('yes');

        addElementTrack(fileId, id, -1, 0, -1, true);
    }
    else
    {
        console.log('no');
    }
}

//RIGHT CLICK
function showContextMenu(e) {
    var trackId = parseInt(this.id.replace('elementView', ''));
    var rowTrack = rowById(trackId, currentProject.tabListTracks);

    var track = currentProject.tabListTracks[rowTrack];

    if(track.currentRow >= 0)
    {
        var element = track.tabElements[track.currentRow];

        eId('contextMenu').style.left = ((document.body.scrollLeft + e.clientX) - $('#globalEdit').offset().left) + 'px';
        eId('contextMenu').style.top = ((document.body.scrollTop + e.clientY) - $('#globalEdit').offset().top) + 'px';

        if(element.parent >= 0)
        {
            eId('buttonBreakLinkCM').setAttribute('onclick', 'breakLinkElements(' + element.id + ', ' + trackId + ');');
            eId('liBreakLinkCM').classList.remove('disabled');
        }
        else
        {
            eId('buttonBreakLinkCM').removeAttribute('onclick');
            eId('liBreakLinkCM').classList.add('disabled');
        }


        eId('buttonEffectsCM').style.display = 'none';
        eId('liEffectsCM').classList.add('disabled');

        eId('buttonOpacityCM').style.display = 'none';
        eId('liOpacityCM').classList.add('disabled');

        if(track.type == TYPE.AUDIO)
        {
            eId('buttonVolumeCM').setAttribute('onclick', 'volumeElementModal(' + element.id + ',' + trackId + ', ' + element.properties.volume + ');');
            eId('liVolumeCM').classList.remove('disabled');
        }
        else
        {
            eId('buttonVolumeCM').removeAttribute('onclick');
            eId('liVolumeCM').classList.add('disabled');
        }

        eId('buttonPropertiesCM').setAttribute('onclick', 'elementProperties(' + rowTrack + ',' + track.currentRow + ');');
        eId('buttonDeleteCM').setAttribute('onclick', 'deleteElement(' + rowTrack + ',' + track.currentRow + ');');

        eId('contextMenu').style.display = 'initial';
    }

    return false;
}

function hideContextMenu() {
    eId('contextMenu').style.display = 'none';
}