/**
 * Created by Dylan on 04/02/2015.
 */

var imageClose = new Image();

imageClose.onload = function() {
    console.log('loaded close');
};

imageClose.src = 'http://clangue.net/other/testVideo/demos/canvastry/img/close.png';

function mouseDown(e) {
    console.log('mousedown');

    var x = ((e.offsetX == undefined)?e.layerX:e.offsetX);
    var row = rowById(parseInt(this.id.replace('videoView', '').replace('audioView', '')), currentProject.tabListTracks);

    currentProject.tabListTracks[row].mousedown = true;
    //currentProject.tabListTracks[row].gap = (currentProject.tabListTracks[row].currentRow >= 0) ? (x - currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft) : 0;
    currentProject.tabListTracks[row].lastX = x;
}

function mouseUp(e) {
    var id = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var row = rowById(id, currentProject.tabListTracks);

    var track = currentProject.tabListTracks[row];
    var currentElement = track.tabElements[track.currentRow];

    track.mousedown = false;

    if(track.currentRow >= 0)
    {
        for(var i = 0; i < track.tabElements.length; i++)
        {
            var element = track.tabElements[i];

            if(element.marginLeft < currentElement.marginLeft && (element.marginLeft + element.width) > (currentElement.marginLeft + currentElement.width))
            {
                console.log('collision between');

                var widthNewElement = element.marginLeft - (currentElement.marginLeft - element.marginLeft);

                element.width = currentElement.marginLeft - element.marginLeft;

                addElement(element.fileId, id, (currentElement.marginLeft + currentElement.width), (currentElement.marginLeft - element.marginLeft) / oneSecond);

                track.tabElements[track.tabElements.length - 1].width = widthNewElement;
            }

            if((currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width) > currentProject.tabListTracks[row].tabElements[i].marginLeft && (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width) < (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width))
            {
                console.log('collision before');

                currentProject.tabListTracks[row].tabElements[i].leftGap += (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width) - currentProject.tabListTracks[row].tabElements[i].marginLeft;

                currentProject.tabListTracks[row].tabElements[i].width = (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) - (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width);
                currentProject.tabListTracks[row].tabElements[i].marginLeft = (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) - ((currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) - (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width));
            }

            if(currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft > currentProject.tabListTracks[row].tabElements[i].marginLeft && currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft < (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width))
            {
                console.log('collision after');

                currentProject.tabListTracks[row].tabElements[i].rightGap += (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) - currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft;

                currentProject.tabListTracks[row].tabElements[i].width = currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft - currentProject.tabListTracks[row].tabElements[i].marginLeft;
            }
        }

        if(track.mode == MODE.REMOVE)
        {
            deleteElement(row, track.currentRow);
        }

        drawElements(row);
    }
}

function mouseMove(e) {
    var id = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var row = rowById(id, currentProject.tabListTracks);

    var track = currentProject.tabListTracks[row];

    var x = ((e.offsetX == undefined) ? e.layerX : e.offsetX) + pixelTimeBar.g;
    var y = (e.offsetY == undefined) ? e.layerY : e.offsetY;

    if(track.mousedown)
    {
        if(track.mode == MODE.MOVE)
        {
            //console.log(x, track.gap, (x - track.gap));

            if((x - track.gap) > 0)
            {
                track.tabElements[track.currentRow].marginLeft = x;
            }
            else
            {
                track.tabElements[track.currentRow].marginLeft = 0;
            }

            haveParent(track, track.tabElements[track.currentRow]);
        }
        else if(track.mode == MODE.RESIZE.LEFT)
        {
            if((x - track.lastX) > 0)
            {
                if(track.tabElements[track.currentRow].width > track.tabElements[track.currentRow].minWidth)
                {
                    track.tabElements[track.currentRow].width--;
                    track.tabElements[track.currentRow].marginLeft++;

                    track.tabElements[track.currentRow].leftGap++;
                }
            }
            else
            {
                if(track.tabElements[track.currentRow].leftGap > 0)
                {
                    track.tabElements[track.currentRow].width++;
                    track.tabElements[track.currentRow].marginLeft--;

                    track.tabElements[track.currentRow].leftGap--;
                }
            }

            track.lastX = x;

            haveParent(track, track.tabElements[track.currentRow]);
        }
        else if(track.mode == MODE.RESIZE.RIGHT)
        {
            if((x - track.lastX) > 0)
            {
                if(track.tabElements[track.currentRow].rightGap > 0)
                {
                    track.tabElements[track.currentRow].width++;

                    track.tabElements[track.currentRow].rightGap--;
                }
            }
            else
            {
                if(track.tabElements[track.currentRow].width > track.tabElements[track.currentRow].minWidth)
                {
                    track.tabElements[track.currentRow].width--;

                    track.tabElements[track.currentRow].rightGap++;
                }
            }

            track.lastX = x;

            haveParent(track, track.tabElements[track.currentRow]);
        }
    }
    else
    {
        rowTabElement(x, row);

        if(track.currentRow >= 0)
        {
            if(x >= (track.tabElements[track.currentRow].marginLeft - 2) && x <= (track.tabElements[track.currentRow].marginLeft + 2))
            {
                track.mode = MODE.RESIZE.LEFT;
                track.canvas.element.style.cursor = 'w-resize';
            }
            else if(x >= (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width - 2) && x <= (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width + 2))
            {
                track.mode = MODE.RESIZE.RIGHT;
                track.canvas.element.style.cursor = 'w-resize';
            }
            else if(track.tabElements[track.currentRow].width >= 16 && x >= ((track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) - 15) && x <= (((track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) - 2)) && y <= 10)
            {
                track.mode = MODE.REMOVE;
                track.canvas.element.style.cursor = 'pointer';
            }
            else
            {
                track.mode = MODE.MOVE;
                track.canvas.element.style.cursor = 'all-scroll';
            }

            console.log(track.mode);
        }
        else
        {
            if(!track.mousedown)
            {
                track.mode = MODE.NONE;
                track.canvas.element.style.cursor = 'default';
            }
        }
    }

    drawElementsTracks();
}

function haveParent(track, element) {
    if(element.parent >= 0)
    {
        var parentTrack = currentProject.tabListTracks[rowById(track.parent, currentProject.tabListTracks)];
        var parentElement = parentTrack.tabElements[rowById(element.parent, parentTrack.tabElements)];

        parentElement.width = element.width;

        parentElement.marginLeft = element.marginLeft;

        parentElement.leftGap = element.leftGap;
        parentElement.rightGap = element.rightGap;
    }
}

function showContextMenu(e) {
    var trackId = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var rowTrack = rowById(trackId, currentProject.tabListTracks);

    var track = currentProject.tabListTracks[rowTrack];

    if(track.currentRow >= 0)
    {
        var element = track.tabElements[track.currentRow];
        var file = currentProject.tabListFiles[rowById(element.fileId, currentProject.tabListFiles)].fileName;

        document.getElementById('contextMenu').style.left = ((document.body.scrollLeft + e.clientX) - $('#globalEdit').offset().left) + 'px';
        document.getElementById('contextMenu').style.top = ((document.body.scrollTop + e.clientY) - $('#globalEdit').offset().top) + 'px';

        document.getElementById('buttonBreakLinkCM').onclick = breakLinkElements(element.id, trackId);
        document.getElementById('buttonPropertiesCM').onclick = elementProperties(element);
        document.getElementById('buttonDeleteCM').onclick = deleteElement(rowTrack, track.currentRow);

        document.getElementById('buttonEffectsCM').disabled = true;
        document.getElementById('buttonOpacityCM').disabled = true;

        if(track.type = TYPE.AUDIO)
        {
            document.getElementById('buttonVolumeCM').onclick = volumeElementModal(element.id, trackId, file.fileName);
        }
        else
        {
            document.getElementById('buttonVolumeCM').disabled = true;
        }

        document.getElementById('contextMenu').style.display = 'initial';
    }

    return false;
}

function hideContextMenu() {
    document.getElementById('contextMenu').style.display = 'none';
}

function rowTabElement(x, row) {
    currentProject.tabListTracks[row].currentRow = -1;

    for(var i = 0; i < currentProject.tabListTracks[row].tabElements.length; i++)
    {
        if(currentProject.tabListTracks[row].tabElements[i].marginLeft <= x && (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) >= x)
        {
            //console.log('row : ', i);

            currentProject.tabListTracks[row].currentRow = i;

            currentProject.tabListTracks[row].tabElements[i].selected = true;
        }
        else
        {
            currentProject.tabListTracks[row].tabElements[i].selected = false;
        }
    }
}

function drawElementsTracks() {
    for(var i = 0; i < currentProject.tabListTracks.length; i++)
    {
        drawElements(i);
    }
}

function drawElements(row) {
    currentProject.tabListTracks[row].canvas.context.fillStyle = '#EFEFEF';
    currentProject.tabListTracks[row].canvas.context.fillRect(0, 0, currentProject.tabListTracks[row].canvas.context.width, currentProject.tabListTracks[row].canvas.context.height);

    var rowSelected = 'none';

    for(var i = 0; i < currentProject.tabListTracks[row].tabElements.length; i++)
    {
        if(currentProject.tabListTracks[row].tabElements[i].selected)
        {
            rowSelected = i;
        }
        else
        {
            element(row, i);
        }
    }

    if(rowSelected != 'none')
    {
        element(row, rowSelected);
    }
}

function element(rowTrack, row) {
    var currentElement = currentProject.tabListTracks[rowTrack].tabElements[row];
    var context = currentProject.tabListTracks[rowTrack].canvas.context;

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = (currentElement.selected) ? 'blue' : 'gray';
    context.rect(currentElement.marginLeft - pixelTimeBar.g, 0, currentElement.width, 100);
    context.stroke();

    //context.fillStyle = (currentProject.tabListTracks[rowTrack].type == TYPE.VIDEO) ? '#A3BDDE' : '#74E4BC';
    context.fillStyle = currentElement.color;
    context.fillRect(currentElement.marginLeft - pixelTimeBar.g, 0, currentElement.width, 100);

    context.font = '15px Calibri';
    context.fillStyle = '#000000';

    //TEXT
    context.fillText(compressName(currentProject.tabListFiles[rowById(currentElement.fileId, currentProject.tabListFiles)].fileName), (currentElement.marginLeft + 2) - pixelTimeBar.g, 12, ((currentElement.width - 20) <= 0) ? 1 : (currentElement.width - 20));

    //CLOSE IMAGE
    if(currentElement.width >= 16)
    {
        context.drawImage(imageClose, (currentElement.marginLeft + currentElement.width - 15) - pixelTimeBar.g, 0, 15, 15);
    }

    //THUMBNAIL IMAGE
    var imageThumbnail = currentElement.thumbnail;

    var newWidth = (imageThumbnail.width * 75) / imageThumbnail.height;

    var sWidth = (newWidth > (currentElement.width - 7)) ? (((currentElement.width - 7) / newWidth) * imageThumbnail.width) : imageThumbnail.width;
    //(currentElement.width < 100) ? (imageThumbnail.width - (((80 - (currentElement.width - 20)) / 80) * imageThumbnail.width)) : imageThumbnail.width;
    var sHeight = imageThumbnail.height;

    var xThumbnail = (currentElement.marginLeft + 2) - pixelTimeBar.g;
    var yThumbnail = 20;

    var widthThumbnail = (newWidth > (currentElement.width - 7)) ? (currentElement.width - 7) : newWidth;
    var heightThumbnail = 75;

    //console.log(sWidth, sHeight, xThumbnail, yThumbnail, newWidth, widthThumbnail, heightThumbnail);

    context.drawImage(imageThumbnail, 0, 0, sWidth, sHeight, xThumbnail, yThumbnail, widthThumbnail, heightThumbnail);
}