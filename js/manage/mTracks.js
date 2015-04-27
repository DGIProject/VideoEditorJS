/**
 * Created by Dylan on 10/02/2015.
 */

var oneSecond = 5;
var pixelTimeBar = {g: 0, d: 734};
var lastZoom = 5;
var scrollTracks = 0;

function addTracks() {
    var id1 = addTrack(TYPE.VIDEO);
    var id2 = addTrack(TYPE.AUDIO);

    setParentTracks(id1, id2);
}

function addTrack(type) {
    rLog('-TRACK- add [type: ' + type + ']');

    var trackId = (currentProject.tabListTracks.length > 0) ? (currentProject.tabListTracks[currentProject.tabListTracks.length - 1].id + 1) : 0;

    var elementInfo = document.createElement('div');
    elementInfo.id = 'elementInfo' + trackId;
    elementInfo.classList.add('singleTrack');
    elementInfo.innerHTML = '<div class="valuesTrack"><span class="bold">' + ((type == TYPE.VIDEO) ? 'VIDEO' : 'AUDIO') + ' ' + trackId + '</span><button type="button" onclick="deleteTrackModal(' + trackId + ');" class="btn btn-link"><span class="glyphicon glyphicon-trash"></span></button></div>';

    var elementView = document.createElement('canvas');
    elementView.id = 'elementView' + trackId;

    elementView.classList.add('singleTrack');
    elementView.classList.add('canvasTrack');

    elementView.onmousedown = mouseDownTracks;

    elementView.ondragover = allowDrop;
    elementView.ondrop = dropFile;

    elementView.oncontextmenu = showContextMenu;

    elementView.width = 740;
    elementView.height = 105;

    var contextElementView = elementView.getContext('2d');
    contextElementView.width = 740;
    contextElementView.height = 105;

    document.getElementById((type == TYPE.VIDEO) ? 'videoInfo' : 'audioInfo').appendChild(elementInfo);
    document.getElementById((type == TYPE.VIDEO) ? 'videoView' : 'audioView').appendChild(elementView);

    currentProject.tabListTracks.push(new Track(trackId, type, {element: elementView, context: contextElementView}));

    drawElements(currentProject.tabListTracks.length - 1);

    return trackId;
}

function setParentTracks(id1, id2) {
    rLog('-TRACK- setParent [id1: ' + id1 + '][id2: ' + id2 + ']');

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
    rLog('-TRACK- delete [trackId: ' + id + ']');

    $('#deleteTrackModal').modal('hide');

    var rowTrack1 = rowById(id, currentProject.tabListTracks);

    deleteGraphicalTrack(rowTrack1, id);

    rLog('-TRACK- delete [parentId: ' + currentProject.tabListTracks[rowTrack1].parent + ']');

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
    rLog('-TRACK- changeZoom');

    document.getElementById('zoomRange').value = zoom;

    lastZoom = (defaultZ) ? zoom : oneSecond;
    oneSecond = zoom;

    calculateTimeBar();
    calculateElementsPixel();

    console.log(oneSecond);
}

function zoomPlus() {
    if (parseInt(document.getElementById('zoomRange').value) < parseInt(document.getElementById('zoomRange').max)) {
        rLog('-TRACK- zoomPlus');

        lastZoom = oneSecond;
        oneSecond = parseInt(document.getElementById('zoomRange').value) + 1;

        document.getElementById('zoomRange').value = oneSecond;

        calculateTimeBar();
        calculateElementsPixel();
    }
}

function zoomLess() {
    if (parseInt(document.getElementById('zoomRange').value) > parseInt(document.getElementById('zoomRange').min)) {
        rLog('-TRACK- zoomLess');

        lastZoom = oneSecond;
        oneSecond = parseInt(document.getElementById('zoomRange').value) - 1;

        document.getElementById('zoomRange').value = oneSecond;

        calculateTimeBar();
        calculateElementsPixel();
    }
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
    var canvas = document.getElementById('timeBarCanvas');
    var ctx = canvas.getContext('2d');

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
}

function mouseMoveTime(x, width) {
    calculateTimeBar();

    var canvas = document.getElementById('timeBarCanvas');
    var ctx = canvas.getContext('2d');

    var text = pixelToTime(x+pixelTimeBar.g);
    ctx.font = "10pt Verdana";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var textPxLength = ctx.measureText(text);

    if (x>0 && x<canvas.width)
    {
        ctx.beginPath();
        ctx.moveTo(x,canvas.height/2);
        ctx.lineTo(x,canvas.height);
        ctx.closePath();
        ctx.stroke();

        if(width != null) {
            if(((width < 0) ? -width : width) >= 64) {
                ctx.fillText(pixelToTime((width < 0) ? -width : width), (x + (width / 2)), (canvas.height - 14), (((width < 0) ? -width : width) - 4));
            }

            ctx.beginPath();
            ctx.moveTo((x + width),canvas.height/2);
            ctx.lineTo((x + width),canvas.height);
            ctx.closePath();
            ctx.stroke();
        }

        var posX = (x<textPxLength.width/2)? textPxLength.width/2 : ( x>(canvas.width-(textPxLength.width)/2))? canvas.width-(textPxLength.width)/2 : x ;
    }
    else
    {
        if (x<0)
        {
            ctx.beginPath();
            ctx.moveTo(0,canvas.height/2);
            ctx.lineTo(0,canvas.height);
            ctx.closePath();
            ctx.stroke();
        }
        else if (x>canvas.width)
        {
            ctx.beginPath();
            ctx.moveTo(canvas.width,canvas.height/2);
            ctx.lineTo(canvas.width,canvas.height);
            ctx.closePath();
            ctx.stroke();
        }
    }

    //Carré blanc derrière le texte
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(posX-(textPxLength.width/2),2,textPxLength.width+2, 12);

    //Texte
    ctx.fillStyle = "#000000";
    ctx.fillText(text,posX,3);
}

//DROP ELEMENT
function allowDrop(e) {
    if(isFirefox)
    {
        var id = parseInt(this.id.replace('elementView', ''));
        var fileId = parseInt(e.dataTransfer.getData('fileId'));

        if(!isNaN(fileId)) {
            var track = currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)];
            var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

            if(file.isVideo && file.isAudio)
            {
                if(track.parent >= 0)
                {
                    e.preventDefault();
                }
            }
            else if((file.isVideo && track.type == TYPE.VIDEO) || (file.isAudio && track.type == TYPE.AUDIO))
            {
                e.preventDefault();
            }
        }
        else
        {
            rLog('-TRACK- drop : not a file [trackId: ' + id + ']');
        }
    }
    else
    {
        e.preventDefault();
    }
}

function dropFile(e) {
    e.preventDefault();

    var id = parseInt(this.id.replace('elementView', ''));
    var fileId = parseInt(e.dataTransfer.getData('fileId'));

    if(!isNaN(fileId)) {
        var track = currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)];
        var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

        if(file.isVideo && file.isAudio)
        {
            if(track.parent >= 0)
            {
                rLog('-TRACK- drop : video/audio file [trackId: ' + id + ']');
                addElementTrack(fileId, id, -1, 0, -1, true);
            }
            else
            {
                rLog('-TRACK- drop : video/audio file / no parent track [trackId: ' + id + ']');
            }
        }
        else if((file.isVideo && track.type == TYPE.VIDEO) || (file.isAudio && track.type == TYPE.AUDIO))
        {
            rLog('-TRACK- drop : allowed [trackId: ' + id + '][typeTrack: ' + track.type + ']');
            addElementTrack(fileId, id, -1, 0, -1, true);
        }
        else
        {
            rLog('-TRACK- drop : not supported file [trackId: ' + id + ']');
        }
    }
    else
    {
        rLog('-TRACK- drop : not a file [trackId: ' + id + ']');
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

        rLog('-TRACK- contextMenu [trackId: ' + trackId + '][elementId: ' + element.id + ']');

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
        eId('buttonDeleteCM').setAttribute('onclick', 'deleteElementModal(' + rowTrack + ',' + track.currentRow + ');');

        eId('contextMenu').style.display = 'initial';
    }

    return false;
}

function hideContextMenu() {
    eId('contextMenu').style.display = 'none';
}