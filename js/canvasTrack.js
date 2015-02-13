/**
 * Created by Dylan on 04/02/2015.
 */

var imageClose = new Image();

imageClose.onload = function() {
    console.log('loaded close');
};

imageClose.src = 'http://clangue.net/other/testVideo/canvastry/img/close.png';

function mouseDown(e) {
    console.log('mousedown');

    var x = ((e.offsetX == undefined)?e.layerX:e.offsetX) - 190;
    var row = rowById(parseInt(this.id.replace('videoView', '').replace('audioView', '')), currentProject.tabListTracks);

    currentProject.tabListTracks[row].mousedown = true;
    currentProject.tabListTracks[row].gap = (currentProject.tabListTracks[row].currentRow >= 0) ? (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width - x) : 0;
    currentProject.tabListTracks[row].lastX = x;
}

function mouseUp(e) {
    var row = rowById(parseInt(this.id.replace('videoView', '').replace('audioView', '')), currentProject.tabListTracks);

    currentProject.tabListTracks[row].mousedown = false;

    if(currentProject.tabListTracks[row].currentRow >= 0)
    {
        for(var i = 0; i < currentProject.tabListTracks[row].tabElements.length; i++)
        {
            if(currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft > currentProject.tabListTracks[row].tabElements[i].marginLeft && currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft < (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width))
            {
                console.log('collision before');

                currentProject.tabListTracks[row].tabElements[i].width = currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft - currentProject.tabListTracks[row].tabElements[i].marginLeft;
            }

            if((currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width) > currentProject.tabListTracks[row].tabElements[i].marginLeft && (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width) < (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width))
            {
                console.log('collision after');

                currentProject.tabListTracks[row].tabElements[i].width = (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) - (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width);
                currentProject.tabListTracks[row].tabElements[i].marginLeft = (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) - ((currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) - (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width));
            }
        }

        drawElements(row);
    }
}

function mouseMove(e) {
    var x = (e.offsetX==undefined?e.layerX:e.offsetX) - 190;

    var id = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var row = rowById(id, currentProject.tabListTracks);

    //console.log('row:' + row, x);

    if(currentProject.tabListTracks[row].mousedown)
    {
        if(currentProject.tabListTracks[row].mode == MODE.MOVE)
        {
            //console.log(x, currentProject.tabListTracks[row].gap, (x - currentProject.tabListTracks[row].gap));

            if((x - currentProject.tabListTracks[row].gap) > 0)
            {
                currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft = x - currentProject.tabListTracks[row].gap;
            }
            else
            {
                currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft = 0;
            }
        }
        else if(currentProject.tabListTracks[row].mode == MODE.RESIZE.LEFT)
        {
            console.log('resize left');
        }
        else if(currentProject.tabListTracks[row].mode == MODE.RESIZE.RIGHT)
        {
            //console.log('resize right');

            //console.log(x, currentProject.tabListTracks[row].lastX, (x - currentProject.tabListTracks[row].lastX));

            if((x - currentProject.tabListTracks[row].lastX) > 0)
            {
                //console.log('ok1');

                if(currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width < currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].maxWidth)
                {
                    //console.log('good1');

                    currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width++;
                    currentProject.tabListTracks[row].gap = x;
                }
            }
            else
            {
                //console.log('ok2');

                if(currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width > currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].minWidth)
                {
                    //console.log('good2');

                    currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width--;
                    currentProject.tabListTracks[row].gap = x;
                }
            }

            currentProject.tabListTracks[row].lastX = x;
        }
    }
    else
    {
        rowTabElement(x, row);

        if(currentProject.tabListTracks[row].currentRow >= 0)
        {
            if(x >= (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft - 2) && x <= (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + 2))
            {
                currentProject.tabListTracks[row].mode = MODE.RESIZE.LEFT;
                currentProject.tabListTracks[row].canvas.element.style.cursor = 'w-resize';
            }
            else if(x >= (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width - 2) && x <= (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width + 2))
            {
                currentProject.tabListTracks[row].mode = MODE.RESIZE.RIGHT;
                currentProject.tabListTracks[row].canvas.element.style.cursor = 'w-resize';
            }
            else
            {
                currentProject.tabListTracks[row].mode = MODE.MOVE;
                currentProject.tabListTracks[row].canvas.element.style.cursor = 'all-scroll';
            }
        }
        else
        {
            if(!currentProject.tabListTracks[row].mousedown)
            {
                currentProject.tabListTracks[row].mode = MODE.NONE;
                currentProject.tabListTracks[row].canvas.element.style.cursor = 'default';
            }

            for(var i = 0; i < currentProject.tabListFiles.length; i++)
            {
                if(currentProject.tabListFiles[i].isSelected)
                {
                    if(currentProject.tabListTracks[row].tabElements.length > 0)
                    {
                        if(currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].tabElements.length - 1].fileId != currentProject.tabListFiles[i].id)
                        {
                            console.log('newElementlength');

                            addElement(i, id, x);
                        }
                        else
                        {
                            console.log('alreadyCreated');

                            currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[i].tabElements.length - 1].marginLeft = x;
                        }
                    }
                    else
                    {
                        console.log('newElement0');

                        addElement(i, id, x);
                    }
                }
            }
        }
    }

    drawElements(row);
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
    context.strokeStyle = (currentProject.tabListTracks[rowTrack].tabElements[row].selected) ? 'blue' : 'gray';
    context.rect(currentProject.tabListTracks[rowTrack].tabElements[row].marginLeft - pixelTimeBar.g, 0, currentProject.tabListTracks[rowTrack].tabElements[row].width, 100);
    context.stroke();

    context.fillStyle = (currentProject.tabListTracks[rowTrack].type == 'VIDEO') ? '#A3BDDE' : '#74E4BC';
    context.fillRect(currentProject.tabListTracks[rowTrack].tabElements[row].marginLeft - pixelTimeBar.g, 0, currentProject.tabListTracks[rowTrack].tabElements[row].width, 100);

    context.font = '15px Calibri';
    context.fillStyle = '#000000';

    //TEXT
    context.fillText(compressName(currentProject.tabListFiles[rowById(currentProject.tabListTracks[rowTrack].tabElements[row].fileId, currentProject.tabListFiles)].fileName), (currentElement.marginLeft + 2) - pixelTimeBar.g, 12, ((currentElement.width - 20) <= 0) ? 1 : (currentElement.width - 20));

    //CLOSE IMAGE
    if(currentElement.width >= 16)
    {
        context.drawImage(imageClose, (currentElement.marginLeft + currentElement.width - 15) - pixelTimeBar.g, 0, 15, 15);
    }

    //THUMBNAIL IMAGE
    var imageThumbnail = currentElement.thumbnail;

    var newWidth = (imageThumbnail.width * 75) / imageThumbnail.height;

    var sWidth = (newWidth > (currentElement.width - 7)) ? (((currentElement.width - 7) / newWidth) * imageThumbnail.width) : imageThumbnail.width;
    //(currentProject.tabListTracks[rowTrack].tabElements[row].width < 100) ? (imageThumbnail.width - (((80 - (currentProject.tabListTracks[rowTrack].tabElements[row].width - 20)) / 80) * imageThumbnail.width)) : imageThumbnail.width;
    var sHeight = imageThumbnail.height;

    var xThumbnail = (currentElement.marginLeft + 2) - pixelTimeBar.g;
    var yThumbnail = 20;

    var widthThumbnail = (newWidth > (currentElement.width - 7)) ? (currentElement.width - 7) : newWidth;
    var heightThumbnail = 75;

    //console.log(sWidth, sHeight, xThumbnail, yThumbnail, newWidth, widthThumbnail, heightThumbnail);

    context.drawImage(imageThumbnail, 0, 0, sWidth, sHeight, xThumbnail, yThumbnail, widthThumbnail, heightThumbnail);
}