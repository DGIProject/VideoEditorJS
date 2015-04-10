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
            var selectedElement = track.tabElements[track.currentRow];
            selectedElement.selected = false;

            if(track.mode == MODE.REMOVE)
            {
                rLog('-CANVASTRACK- remove mode');
                deleteElement(x, track.currentRow);
            }

            track.mode = MODE.NONE;
            track.currentRow = -1;

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
        }

        drawElements(x);
    }
}