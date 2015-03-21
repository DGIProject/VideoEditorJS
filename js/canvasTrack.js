/**
 * Created by Dylan on 04/02/2015.
 */

function mouseDown(e) {
    console.log('mousedown');

    var x = ((e.offsetX == undefined)?e.layerX:e.offsetX);
    var row = rowById(parseInt(this.id.replace('videoView', '').replace('audioView', '')), currentProject.tabListTracks);

    currentProject.tabListTracks[row].mousedown = true;
    currentProject.tabListTracks[row].gap = (currentProject.tabListTracks[row].currentRow >= 0) ? (x - currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft) : 0;
    currentProject.tabListTracks[row].lastX = x;
}

function mouseUp() {
    for(var x = 0; x < currentProject.tabListTracks.length; x++)
    {
        var track = currentProject.tabListTracks[x];
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

                    addElement(element.fileId, track.id, (currentElement.marginLeft + currentElement.width), (currentElement.marginLeft - element.marginLeft) / oneSecond);

                    track.tabElements[track.tabElements.length - 1].width = widthNewElement;
                }

                if((track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) > track.tabElements[i].marginLeft && (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) < (track.tabElements[i].marginLeft + track.tabElements[i].width))
                {
                    console.log('collision before');

                    track.tabElements[i].leftGap += (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) - track.tabElements[i].marginLeft;

                    track.tabElements[i].width = (track.tabElements[i].marginLeft + track.tabElements[i].width) - (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width);
                    track.tabElements[i].marginLeft = (track.tabElements[i].marginLeft + track.tabElements[i].width) - ((track.tabElements[i].marginLeft + track.tabElements[i].width) - (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width));
                }

                if(track.tabElements[track.currentRow].marginLeft > track.tabElements[i].marginLeft && track.tabElements[track.currentRow].marginLeft < (track.tabElements[i].marginLeft + track.tabElements[i].width))
                {
                    console.log('collision after');

                    track.tabElements[i].rightGap += (track.tabElements[i].marginLeft + track.tabElements[i].width) - track.tabElements[track.currentRow].marginLeft;

                    track.tabElements[i].width = track.tabElements[track.currentRow].marginLeft - track.tabElements[i].marginLeft;
                }
            }

            if(track.mode == MODE.REMOVE)
            {
                console.log('delete : ' + track.tabElements[track.currentRow]);
                
                deleteElement(x, track.currentRow);
            }

            drawElements(x);
        }
    }
}

function mouseMove(e) {
    var id = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var row = rowById(id, currentProject.tabListTracks);

    var track = currentProject.tabListTracks[row];

    var x = ((e.offsetX == undefined) ? e.layerX : e.offsetX) /*+ pixelTimeBar.g*/;
    var y = (e.offsetY == undefined) ? e.layerY : e.offsetY;

    //console.log('x : ' + x, pixelTimeBar.g);

    if(track.mousedown)
    {
        if(track.mode == MODE.MOVE)
        {
            //console.log(x, track.gap, (x - track.gap));

            if((x - track.gap) > 0)
            {
                //console.log('marginLeft : ' + x);

                track.tabElements[track.currentRow].marginLeft = x - track.gap;
            }
            else
            {
                track.tabElements[track.currentRow].marginLeft = 0;
            }

            setPropertiesParent(track.parent, track.tabElements[track.currentRow]);
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

            setPropertiesParent(track.parent, track.tabElements[track.currentRow]);
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

            setPropertiesParent(track.parent, track.tabElements[track.currentRow]);
        }
    }
    else
    {
        track.currentRow = rowElement(x, row);

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

            //console.log(track.mode);
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

function setPropertiesParent(trackParent, element) {
    if(element.parent >= 0)
    {
        var parentTrack = currentProject.tabListTracks[rowById(trackParent, currentProject.tabListTracks)];
        var parentElement = parentTrack.tabElements[rowById(element.parent, parentTrack.tabElements)];

        parentElement.width = element.width;

        parentElement.marginLeft = element.marginLeft;

        parentElement.leftGap = element.leftGap;
        parentElement.rightGap = element.rightGap;
    }
}

function rowElement(x, row) {
    var track = currentProject.tabListTracks[row];
    var currentRow = -1;

    for(var i = 0; i < track.tabElements.length; i++)
    {
        if(track.tabElements[i].marginLeft <= x && (track.tabElements[i].marginLeft + track.tabElements[i].width) >= x)
        {
            currentRow = i;
            track.tabElements[i].selected = true;
        }
        else
        {
            track.tabElements[i].selected = false;
        }
    }

    return currentRow;
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

    var gapError = ((currentElement.marginLeft * 2) / 198);

    //console.log('element marginLeft : ' + currentElement.marginLeft, gapError);

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = (currentElement.selected) ? 'blue' : 'gray';
    context.rect(currentElement.marginLeft + gapError /*- pixelTimeBar.g*/, 0, currentElement.width, 100);
    context.stroke();

    context.fillStyle = currentElement.color;
    context.fillRect(currentElement.marginLeft + gapError /*- pixelTimeBar.g*/, 0, currentElement.width, 100);

    context.font = '15px Calibri';
    context.fillStyle = '#000000';

    //TEXT
    context.fillText(compressName(currentProject.tabListFiles[rowById(currentElement.fileId, currentProject.tabListFiles)].fileName), (currentElement.marginLeft + gapError + 2) /*- pixelTimeBar.g*/, 12, ((currentElement.width - 20) <= 0) ? 1 : (currentElement.width - 20));

    //CLOSE IMAGE
    if(currentElement.width >= 16)
    {
        context.drawImage(imageClose, (currentElement.marginLeft + gapError + currentElement.width - 15) /*- pixelTimeBar.g*/, 0, 15, 15);
    }

    //THUMBNAIL IMAGE
    var imageThumbnail = currentElement.thumbnail;

    if(currentElement.type == TYPE.VIDEO)
    {
        var newWidth = (imageThumbnail.width * 75) / imageThumbnail.height;

        var sWidth = (newWidth > (currentElement.width - 7)) ? (((currentElement.width - 7) / newWidth) * imageThumbnail.width) : imageThumbnail.width;
        //(currentElement.width < 100) ? (imageThumbnail.width - (((80 - (currentElement.width - 20)) / 80) * imageThumbnail.width)) : imageThumbnail.width;
        var sHeight = imageThumbnail.height;

        var xThumbnail = (currentElement.marginLeft + gapError + 2) /*- pixelTimeBar.g*/;
        var yThumbnail = 20;

        var widthThumbnail = (newWidth > (currentElement.width - 7)) ? (currentElement.width - 7) : newWidth;
        var heightThumbnail = 75;

        //console.log(sWidth + ' - ' + sHeight + ' - ' + xThumbnail + ' - ' + yThumbnail + ' - ' + newWidth + ' - ' + widthThumbnail + ' - ' + heightThumbnail);

        if(sWidth > 0 && widthThumbnail > 0)
        {
            context.drawImage(imageThumbnail, 0, 0, sWidth, sHeight, xThumbnail, yThumbnail, widthThumbnail, heightThumbnail);
        }
    }
    else
    {
        var ratio = imageThumbnail.width / currentElement.maxWidth;

        var sx = ratio * currentElement.leftGap;
        var sy = 0;

        var sWidth = imageThumbnail.width - (ratio * currentElement.leftGap) - (ratio * currentElement.rightGap);
        var sHeight = imageThumbnail.height;

        var xThumbnail = currentElement.marginLeft + gapError /*- pixelTimeBar.g*/;
        var yThumbnail = 20;

        var widthThumbnail = currentElement.width;
        var heightThumbnail = /*(imageThumbnail.height / imageThumbnail.width) * widthThumbnail*/ 75;

        //console.log(ratio + ' - ' + sx + ' - ' + sy + ' - ' + sWidth + ' - ' + sHeight + ' - ' + xThumbnail + ' - ' + yThumbnail + ' - ' + widthThumbnail + ' - ' + heightThumbnail);

        context.drawImage(imageThumbnail, sx, sy, sWidth, sHeight, xThumbnail, yThumbnail, widthThumbnail, heightThumbnail);
    }

    /*
    for(var posX = 0; posX < 500; posX = posX + 20)
    {
        context.beginPath();
        context.moveTo(posX, 0);
        context.lineTo(posX, 75);
        context.stroke();
    }
    */
}