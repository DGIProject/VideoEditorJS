/**
 * Created by Dylan on 04/02/2015.
 */
var imageThumbnail = new Image();

imageThumbnail.onload = function() {
    console.log('loaded thumbnail');
};

imageThumbnail.src = 'http://clangue.net/other/testVideo/canvastry/img/thumbnail.png';

var imageClose = new Image();

imageClose.onload = function() {
    console.log('loaded close');
};

imageClose.src = 'http://clangue.net/other/testVideo/canvastry/img/close.png';

var scroll = 0;

function mouseDown(e) {
    console.log('mousedown');

    var row = rowById(parseInt(this.id.replace('videoView', '').replace('audioView', '')));

    currentProject.tabListTracks[row].mousedown = true;
    currentProject.tabListTracks[row].gap = (currentProject.tabListTracks[row].currentRow != 'none') ? (currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft + currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width - ((e.offsetX == undefined)?e.layerX:e.offsetX)) : 0;
}

function mouseUp(e) {
    var row = rowById(parseInt(this.id.replace('videoView', '').replace('audioView', '')));

    currentProject.tabListTracks[row].mousedown = false;

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

function mouseMove(e) {
    var x = (e.offsetX==undefined?e.layerX:e.offsetX) - 190;
    var row = rowById(parseInt(this.id.replace('videoView', '').replace('audioView', '')));

    console.log('row:' + row, x);

    if(currentProject.tabListTracks[row].mousedown)
    {
        if(currentProject.tabListTracks[row].mode == MODE.MOVE)
        {
            //console.log(gap, x, (x - gap));

            currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft = x - currentProject.tabListTracks[row].gap;
        }
        else if(currentProject.tabListTracks[row].mode == MODE.RESIZE.LEFT)
        {
            console.log('resize left');
        }
        else if(currentProject.tabListTracks[row].mode == MODE.RESIZE.RIGHT)
        {
            //console.log('resize right');
            //console.log(x-gap);

            if((x - currentProject.tabListTracks[row].gap) > 0)
            {
                if(currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width < currentProject.tabListTracks[row][row].tabElements[currentProject.tabListTracks[row][row].currentRow].maxWidth)
                {
                    //console.log('good');

                    currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width++;
                    currentProject.tabListTracks[row].gap = x;
                }
            }
            else
            {
                if(currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width > currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].minWidth)
                {
                    //console.log('good');

                    currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].width--;
                    currentProject.tabListTracks[row].gap = x;
                }
            }
        }
    }
    else
    {
        rowTabElement(x, row);

        if(currentProject.tabListTracks[row].currentRow != 'none')
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
        }
    }

    drawElements(row);
}

function rowById(id)
{
    var row = -1;

    for(var i = 0; i < currentProject.tabListTracks.length; i++)
    {
        if(currentProject.tabListTracks[i].id == id)
        {
            row = i;
        }
    }

    return row;
}

function plusScroll() {
    scroll += 2;
    //drawElements();
}

function lessScroll() {
    if(scroll >= 2)
    {
        scroll -= 2;
        //drawElements();
    }
}

function rowTabElement(x, row) {
    currentProject.tabListTracks[row].currentRow = 'none';

    for(var i = 0; i < currentProject.tabListTracks[row].tabElements.length; i++)
    {
        if(currentProject.tabListTracks[row].tabElements[i].marginLeft <= x && (currentProject.tabListTracks[row].tabElements[i].marginLeft + currentProject.tabListTracks[row].tabElements[i].width) >= x)
        {
            console.log('row : ', i);

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
    console.log('test:' + rowTrack, row);
    console.log(currentProject.tabListTracks[rowTrack].tabElements[row].selected);

    currentProject.tabListTracks[rowTrack].canvas.context.beginPath();
    currentProject.tabListTracks[rowTrack].canvas.context.lineWidth = 1;
    currentProject.tabListTracks[rowTrack].canvas.context.strokeStyle = (currentProject.tabListTracks[rowTrack].tabElements[row].selected) ? 'blue' : 'gray';
    currentProject.tabListTracks[rowTrack].canvas.context.rect(currentProject.tabListTracks[rowTrack].tabElements[row].marginLeft - scroll, 0, currentProject.tabListTracks[rowTrack].tabElements[row].width, 100);
    currentProject.tabListTracks[rowTrack].canvas.context.stroke();

    currentProject.tabListTracks[rowTrack].canvas.context.fillStyle = (currentProject.tabListTracks[rowTrack].type == 'VIDEO') ? '#A3BDDE' : '#74E4BC';
    currentProject.tabListTracks[rowTrack].canvas.context.fillRect(currentProject.tabListTracks[rowTrack].tabElements[row].marginLeft - scroll, 0, currentProject.tabListTracks[rowTrack].tabElements[row].width, 100);

    currentProject.tabListTracks[rowTrack].canvas.context.font = '15px Calibri';
    currentProject.tabListTracks[rowTrack].canvas.context.fillStyle = '#000000';
    currentProject.tabListTracks[rowTrack].canvas.context.fillText('Test', (currentProject.tabListTracks[rowTrack].tabElements[row].marginLeft + 10) - scroll, 15);

    currentProject.tabListTracks[rowTrack].canvas.context.drawImage(imageClose, (currentProject.tabListTracks[rowTrack].tabElements[row].marginLeft + currentProject.tabListTracks[rowTrack].tabElements[row].width - 20) - scroll, 5, 15, 15);

    var showWidth = (currentProject.tabListTracks[rowTrack].tabElements[row].width < 100) ? (imageThumbnail.width - (((80 - (currentProject.tabListTracks[rowTrack].tabElements[row].width - 20)) / 80) * imageThumbnail.width)) : imageThumbnail.width;

    //console.log(showWidth, (80 - (currentProject.tabListTracks[rowTrack].tabElements[row].width - 20)), (((80 - (currentProject.tabListTracks[rowTrack].tabElements[row].width - 20)) / 80) * imageThumbnail.width), imageThumbnail.width);

    currentProject.tabListTracks[rowTrack].canvas.context.drawImage(imageThumbnail, 0, 0, showWidth, imageThumbnail.height, (currentProject.tabListTracks[rowTrack].tabElements[row].marginLeft + 10) - scroll, 35, (currentProject.tabListTracks[rowTrack].tabElements[row].width < 100) ? (80 - (80 - (currentProject.tabListTracks[rowTrack].tabElements[row].width - 20))) : 80, 80 * (imageThumbnail.height / imageThumbnail.width));
}