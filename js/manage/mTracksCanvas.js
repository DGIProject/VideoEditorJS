/**
 * Created by Dylan on 10/04/2015.
 */

function analyzeCollision() {
    for(var x = 0; x < currentProject.tabListTracks.length; x++)
    {
        var track = currentProject.tabListTracks[x];
        track.mousedown = false;
        
        if(track.currentRow >= 0)
        {
            console.log(track.currentRow);

            var selectedElement = track.tabElements[track.currentRow];
            selectedElement.selected = false;

            if(track.mode == MODE.REMOVE)
            {
                rLog('-CANVASTRACK- remove mode');
                deleteElement(x, track.currentRow);
            }

            for(var i = 0; i < track.tabElements.length; i++)
            {
                var element = track.tabElements[i];

                if(element.marginLeft > selectedElement.marginLeft && (element.marginLeft + element.width) < (selectedElement.marginLeft + selectedElement.width))
                {
                    rLog('-CANVASTRACK- collision in');

                    deleteElement(x, i);
                }
                else
                {
                    if(element.marginLeft < selectedElement.marginLeft && (element.marginLeft + element.width) > (selectedElement.marginLeft + selectedElement.width))
                    {
                        rLog('-CANVASTRACK- collision between');

                        var newMarginLeft = selectedElement.marginLeft + selectedElement.width + 1;
                        var widthNewElement = element.width - /*(selectedElement.width + (selectedElement.marginLeft - element.marginLeft))*/ ((selectedElement.marginLeft + selectedElement.width) - element.marginLeft);
                        var newBeginDuration = (element.beginDuration + ((selectedElement.marginLeft - element.marginLeft) / oneSecond));

                        console.log(newMarginLeft, widthNewElement, newBeginDuration);

                        element.width = selectedElement.marginLeft - element.marginLeft;

                        addElementTrack(element.fileId, track.id, newMarginLeft, newBeginDuration, {resize: true, width: widthNewElement, leftGap: selectedElement.width}, (element.parent >= 0));

                        /*
                         track.tabElements[track.tabElements.length - 1].width = widthNewElement;
                         track.tabElements[track.tabElements.length - 1].leftGap = selectedElement.width;
                         */
                    }

                    if((track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) > track.tabElements[i].marginLeft && (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) < (track.tabElements[i].marginLeft + track.tabElements[i].width))
                    {
                        rLog('-CANVASTRACK- collision before');

                        track.tabElements[i].leftGap += (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) - track.tabElements[i].marginLeft;

                        track.tabElements[i].width = (track.tabElements[i].marginLeft + track.tabElements[i].width) - (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width);
                        track.tabElements[i].marginLeft = (track.tabElements[i].marginLeft + track.tabElements[i].width) - ((track.tabElements[i].marginLeft + track.tabElements[i].width) - (track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width));
                    }

                    if(track.tabElements[track.currentRow].marginLeft > track.tabElements[i].marginLeft && track.tabElements[track.currentRow].marginLeft < (track.tabElements[i].marginLeft + track.tabElements[i].width))
                    {
                        rLog('-CANVASTRACK- collision after');

                        track.tabElements[i].rightGap += (track.tabElements[i].marginLeft + track.tabElements[i].width) - track.tabElements[track.currentRow].marginLeft;

                        track.tabElements[i].width = track.tabElements[track.currentRow].marginLeft - track.tabElements[i].marginLeft;
                    }
                }
            }

            track.mode = MODE.NONE;
            track.currentRow = -1;
        }

        drawElements(x);
    }
}

function mouseDownTracks(e) {

}

function mouseMoveTracks(e) {
    if(e.target.nodeName == 'CANVAS') {
        var id = parseInt(e.target.id.replace('elementView', ''));
        //console.log(id);

        if(id == undefined)
            return;

        var row = rowById(id, currentProject.tabListTracks);

        var track = currentProject.tabListTracks[row];

        var x = ((e.offsetX == undefined) ? e.layerX : e.offsetX);
        var y = e.clientY - $('#' + e.target.id).offset().top;

        if(track.mousedown)
        {
            if(track.mode == MODE.MOVE)
            {
                if((x - track.gap) > 0)
                {
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
                    if(track.tabElements[track.currentRow].width > track.tabElements[track.currentRow].minWidth) {
                        if (track.tabElements[track.currentRow].type == TYPE.TEXT || track.tabElements[track.currentRow].type == TYPE.IMAGE)
                        {
                            track.tabElements[track.currentRow].width--;
                            track.tabElements[track.currentRow].marginLeft++;
                        }
                        else
                        {
                            track.tabElements[track.currentRow].width--;
                            track.tabElements[track.currentRow].marginLeft++;

                            track.tabElements[track.currentRow].leftGap++;
                        }
                    }
                }
                else
                {
                    if (track.tabElements[track.currentRow].type == TYPE.TEXT || track.tabElements[track.currentRow].type == TYPE.IMAGE)
                    {
                        track.tabElements[track.currentRow].width++;
                        track.tabElements[track.currentRow].marginLeft--;
                    }
                    else if(track.tabElements[track.currentRow].leftGap > 0)
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
                    if (track.tabElements[track.currentRow].type == TYPE.TEXT || track.tabElements[track.currentRow].type == TYPE.IMAGE)
                    {
                        track.tabElements[track.currentRow].width++;
                    }
                    else if(track.tabElements[track.currentRow].rightGap > 0 )
                    {
                        track.tabElements[track.currentRow].width++;

                        track.tabElements[track.currentRow].rightGap--;
                    }

                }
                else
                {
                    if (track.tabElements[track.currentRow].type == TYPE.TEXT || track.tabElements[track.currentRow].type == TYPE.IMAGE)
                    {
                        track.tabElements[track.currentRow].width--;
                    }
                    else if(track.tabElements[track.currentRow].width > track.tabElements[track.currentRow].minWidth)
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
    }

    drawElementsTracks();
}