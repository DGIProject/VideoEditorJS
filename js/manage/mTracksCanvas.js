/**
 * Created by Dylan on 10/04/2015.
 */


//fonction de détection des collisions des éléments mais aussi de déselection des éléments lorsque la souris est hors de la piste,
// elle est appelée lorsque le bouton de la souris est relaché
function analyzeCollision() {
    rLog('-TRACK- canvas : analyseCollision');

    for(var x = 0; x < currentProject.tabListTracks.length; x++)
    {
        var track = currentProject.tabListTracks[x];
        track.mousedown = false;

        var currentRow = track.currentRow;
        
        if(currentRow >= 0)
        {
            //Détection de l'élément séléctionné s'il y en a un
            var selectedElement = track.tabElements[currentRow];

            rLog('-TRACK- selected element [rowTrack:' + x + '][elementId: ' + selectedElement.id + ']');

            //Suppression de l'élément si c'est le mode choisi par l'utilisateur
            if(track.mode == MODE.REMOVE)
            {
                deleteElementModal(x, currentRow);
            }
            else
            {
                //Vérification pour chaque élément s'il y a une collision
                for(var i = 0; i < track.tabElements.length; i++)
                {
                    var element = track.tabElements[i];

                    if(element.marginLeft > selectedElement.marginLeft && (element.marginLeft + element.width) < (selectedElement.marginLeft + selectedElement.width))
                    {
                        rLog('-TRACK- canvas : collision in [elementId: ' + selectedElement.id + '][collisionElementId: ' + element.id + ']');

                        deleteElement(x, i);
                    }
                    else
                    {
                        if(element.marginLeft < selectedElement.marginLeft && (element.marginLeft + element.width) > (selectedElement.marginLeft + selectedElement.width))
                        {
                            rLog('-TRACK- canvas : collision between [elementId: ' + selectedElement.id + '][collisionElementId: ' + element.id + ']');

                            //L'élément a été déplacé sur un autre élément, dans ce cas on redimentionne l'élément qui a subit la subit la collision
                            //puis on crée un autre élément avec l'élément séléctionné.

                            var newMarginLeft = selectedElement.marginLeft + selectedElement.width;
                            var widthNewElement = element.width - /*(selectedElement.width + (selectedElement.marginLeft - element.marginLeft))*/ ((selectedElement.marginLeft + selectedElement.width) - element.marginLeft);
                            var newBeginDuration = (element.beginDuration + ((selectedElement.marginLeft - element.marginLeft) / oneSecond));

                            console.log(newMarginLeft, widthNewElement, newBeginDuration);

                            element.width = selectedElement.marginLeft - element.marginLeft;

                            addElementTrack(element.fileId, track.id, newMarginLeft, newBeginDuration, {resize: true, width: widthNewElement, leftGap: selectedElement.width}, (element.parent >= 0));
                            setPropertiesParent(track.parent, track.tabElements[i]);
                        }

                        if((selectedElement.marginLeft + selectedElement.width) > track.tabElements[i].marginLeft && (selectedElement.marginLeft + selectedElement.width) < (track.tabElements[i].marginLeft + track.tabElements[i].width))
                        {
                            rLog('-TRACK- canvas : collision before [elementId: ' + selectedElement.id + '][collisionElementId: ' + element.id + ']');

                            track.tabElements[i].leftGap += (selectedElement.marginLeft + selectedElement.width) - track.tabElements[i].marginLeft;

                            track.tabElements[i].width = (track.tabElements[i].marginLeft + track.tabElements[i].width) - (selectedElement.marginLeft + selectedElement.width);
                            track.tabElements[i].marginLeft = (track.tabElements[i].marginLeft + track.tabElements[i].width) - ((track.tabElements[i].marginLeft + track.tabElements[i].width) - (selectedElement.marginLeft + selectedElement.width));

                            setPropertiesParent(track.parent, track.tabElements[i]);
                        }

                        if(selectedElement.marginLeft > track.tabElements[i].marginLeft && selectedElement.marginLeft < (track.tabElements[i].marginLeft + track.tabElements[i].width))
                        {
                            rLog('-TRACK- canvas : collision after [elementId: ' + selectedElement.id + '][collisionElementId: ' + element.id + ']');

                            track.tabElements[i].rightGap += (track.tabElements[i].marginLeft + track.tabElements[i].width) - selectedElement.marginLeft;

                            track.tabElements[i].width = selectedElement.marginLeft - track.tabElements[i].marginLeft;

                            setPropertiesParent(track.parent, track.tabElements[i]);
                        }
                    }
                }
            }

            track.mode = MODE.NONE;
        }

        drawElements(x);
    }
}

//Le bouton gauche de la souris est enfoncé, on précise sur quelle piste , lorsqu'un élément est séléctionné, l'écart entre le dépuis de l'élément et la souris
function mouseDownTracks(e) {
    if(e.button == 0) {
        var x = ((e.offsetX == undefined)?e.layerX:e.offsetX);
        var row = rowById(parseInt(this.id.replace('elementView', '')), currentProject.tabListTracks);

        rLog('-TRACK- canvas : mousedown [rowTrack: ' + row + ']');

        currentProject.tabListTracks[row].mousedown = true;
        currentProject.tabListTracks[row].gap = (currentProject.tabListTracks[row].currentRow >= 0) ? (x - currentProject.tabListTracks[row].tabElements[currentProject.tabListTracks[row].currentRow].marginLeft) : 0;
        currentProject.tabListTracks[row].lastX = x;
    }
}

//La souris bouge dans la fenêtre, on cherche s'il n'y a pas d'action en cours avec l'élément ou détermination du mode
function mouseMoveTracks(e) {
    if(e.target.nodeName == 'CANVAS') {
        var id = parseInt(e.target.id.replace('elementView', ''));

        if(isNaN(id))
            return;

        var row = rowById(id, currentProject.tabListTracks);

        var track = currentProject.tabListTracks[row];

        var x = ((e.offsetX == undefined) ? e.layerX : e.offsetX);
        var y = e.clientY - $('#' + e.target.id).offset().top;

        //si la souris est enfoncée, alors on effecture le mode choisi aussi non on cherche en fonction de la position de la souris le mode
        if(track.mousedown)
        {
            if(track.mode == MODE.MOVE)
            {
                if((x - track.gap) >= 0)
                {
                    track.tabElements[track.currentRow].marginLeft = x - track.gap;
                }
                else
                {
                    track.tabElements[track.currentRow].marginLeft = 0;
                }

                setPropertiesParent(track.parent, track.tabElements[track.currentRow]);
                mouseMoveTime(track.tabElements[track.currentRow].marginLeft - pixelTimeBar.g, track.tabElements[track.currentRow].width);
            }
            else if(track.mode == MODE.RESIZE.LEFT)
            {
                if((x - track.lastX) > 0)
                {
                    if(track.tabElements[track.currentRow].width >= track.tabElements[track.currentRow].minWidth) {
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
                mouseMoveTime(track.tabElements[track.currentRow].marginLeft - pixelTimeBar.g, track.tabElements[track.currentRow].width);
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
                    if(track.tabElements[track.currentRow].width >= track.tabElements[track.currentRow].minWidth) {
                        if (track.tabElements[track.currentRow].type == TYPE.TEXT || track.tabElements[track.currentRow].type == TYPE.IMAGE)
                        {
                            track.tabElements[track.currentRow].width--;
                        }
                        else
                        {
                            track.tabElements[track.currentRow].width--;
                            track.tabElements[track.currentRow].rightGap++;
                        }
                    }
                }

                track.lastX = x;

                setPropertiesParent(track.parent, track.tabElements[track.currentRow]);
                mouseMoveTime((track.tabElements[track.currentRow].marginLeft + track.tabElements[track.currentRow].width) - pixelTimeBar.g, -track.tabElements[track.currentRow].width);
            }
            else
            {
                mouseMoveTime(x - pixelTimeBar.g, null);
            }

            if(track.tabElements[track.currentRow].marginLeft >= (pixelTimeBar.d - 75) && !timeoutAutoScroll) {
                console.log('auto scroll plus');

                timeoutAutoScroll = setTimeout(function() {
                    autoScrollPlus(row, track.currentRow);
                }, 50);
            }

            if(track.tabElements[track.currentRow].marginLeft <= (pixelTimeBar.g + 75)) {
                console.log('auto scroll less');

                timeoutAutoScroll = setTimeout(function() {
                    autoScrollLess(row, track.currentRow);
                }, 50);
            }
        }
        else
        {
            mouseMoveTime(x - pixelTimeBar.g, null);

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

function autoScrollPlus(rowTrack, rowElement) {
    console.log(rowTrack, rowElement);
    console.log(timeoutAutoScroll);

    if(rowElement >= 0) {
        if(currentProject.tabListTracks[rowTrack].tabElements[rowElement].marginLeft >= (pixelTimeBar.d - 75) && currentProject.tabListTracks[rowTrack].mousedown) {
            document.getElementById('videoView').scrollLeft += 10;
            document.getElementById('audioView').scrollLeft += 10;

            pixelTimeBar.g += 10;
            pixelTimeBar.d += 10;

            currentProject.tabListTracks[rowTrack].tabElements[rowElement].marginLeft += 10;

            scrollPlusTracks();
            calculateTimeBar();
            drawElementsTracks();

            timeoutAutoScroll = setTimeout(function() {
                autoScrollPlus(rowTrack, rowElement);
            }, 200);
        }
        else
        {
            clearTimeout(timeoutAutoScroll);
            timeoutAutoScroll = false;
        }
    }
    else
    {
        clearTimeout(timeoutAutoScroll);
        timeoutAutoScroll = false;
    }
}

function autoScrollLess(rowTrack, rowElement) {
    if(pixelTimeBar.g > 0) {
        console.log(rowTrack, rowElement);
        console.log(timeoutAutoScroll);

        if(rowElement >= 0) {
            if(currentProject.tabListTracks[rowTrack].tabElements[rowElement].marginLeft <= (pixelTimeBar.g + 75) && currentProject.tabListTracks[rowTrack].mousedown) {
                document.getElementById('videoView').scrollLeft -= 10;
                document.getElementById('audioView').scrollLeft -= 10;

                pixelTimeBar.g -= 10;
                pixelTimeBar.d -= 10;

                currentProject.tabListTracks[rowTrack].tabElements[rowElement].marginLeft -= 10;

                if(currentProject.tabListTracks[rowTrack].tabElements[rowElement].marginLeft <= 0) {
                    currentProject.tabListTracks[rowTrack].tabElements[rowElement].marginLeft = 0;
                }

                scrollPlusTracks();
                calculateTimeBar();
                drawElementsTracks();

                timeoutAutoScroll = setTimeout(function() {
                    autoScrollLess(rowTrack, rowElement);
                }, 500);
            }
            else
            {
                clearTimeout(timeoutAutoScroll);
                timeoutAutoScroll = false;
            }
        }
        else
        {
            clearTimeout(timeoutAutoScroll);
            timeoutAutoScroll = false;
        }
    }
    else
    {
        clearInterval(timeoutAutoScroll);
        timeoutAutoScroll = false;
    }
}

//lors des modifications d'un élément sur une piste si celui-ci possède un "ami" alors on change aussi ses valeurs (taille, marge, écarts sur les côtés)
function setPropertiesParent(trackParent, element) {
    if(element.parent >= 0)
    {
        var rowParentTrack = rowById(trackParent, currentProject.tabListTracks);

        var parentTrack = currentProject.tabListTracks[rowById(trackParent, currentProject.tabListTracks)];
        var parentElement = parentTrack.tabElements[rowById(element.parent, parentTrack.tabElements)];

        parentElement.width = element.width;

        parentElement.marginLeft = element.marginLeft;

        parentElement.leftGap = element.leftGap;
        parentElement.rightGap = element.rightGap;

        drawElements(rowParentTrack);
    }
}

//en fonction de la position de la souris, détection de l'élément survolé et renvoi de son rang dans le tableau aussi non renvoi de -1
function rowElement(x, row) {
    deselectAllElements();

    var track = currentProject.tabListTracks[row];
    var currentRow = -1;

    var rowParentTrack, rowParentElement;

    for(var i = 0; i < track.tabElements.length; i++) {
        if(track.tabElements[i].marginLeft <= x && (track.tabElements[i].marginLeft + track.tabElements[i].width) >= x)
        {
            currentRow = i;
            track.tabElements[i].selected = true;

            if(track.tabElements[i].parent >= 0)
            {
                rowParentTrack = rowById(track.parent, currentProject.tabListTracks);
                rowParentElement = rowById(track.tabElements[i].parent, currentProject.tabListTracks[rowParentTrack].tabElements);

                if(rowParentElement >= 0) {
                    currentProject.tabListTracks[rowParentTrack].currentRow = rowParentElement;
                    currentProject.tabListTracks[rowParentTrack].tabElements[rowParentElement].selected = true;
                }
            }
        }
    }

    return currentRow;
}

function deselectAllElements() {
    for(var i = 0; i < currentProject.tabListTracks.length; i++) {
        for(var x = 0; x < currentProject.tabListTracks[i].tabElements.length; x++) {
            if(!currentProject.tabListTracks[i].mousedown) {
                currentProject.tabListTracks[i].currentRow = -1;
                currentProject.tabListTracks[i].tabElements[x].selected = false;
            }
        }
    }
}

//Dessiner les élements sur chaque piste
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

        element(row, i);
    }

    if(rowSelected != 'none')
    {
        element(row, rowSelected);
    }
}

//ajout de chaque élément (création de deux carrés : un pour les bordures et l'autre pour le remplissage puis ajout de l'aperçu, du titre et du bouton suppression)
function element(rowTrack, row) {
    var currentElement = currentProject.tabListTracks[rowTrack].tabElements[row];
    var context = currentProject.tabListTracks[rowTrack].canvas.context;

    var gapErrorMarginLeft = ((currentElement.marginLeft * 2) / 198);
    var gapErrorWidth = ((currentElement.width * 2) / 198);

    var marginLeftWithGap = currentElement.marginLeft + gapErrorMarginLeft;
    var widthWithGap = currentElement.width + gapErrorWidth;

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = (currentElement.selected) ? 'blue' : 'gray';
    context.rect(marginLeftWithGap, 0, widthWithGap, 100);
    context.stroke();

    context.fillStyle = currentElement.color;
    context.fillRect(marginLeftWithGap, 0, widthWithGap, 100);

    context.font = '15px Calibri';
    context.fillStyle = '#000000';

    //TEXT
    context.fillText(compressName(currentProject.tabListFiles[rowById(currentElement.fileId, currentProject.tabListFiles)].fileName), (marginLeftWithGap + 2), 12, ((widthWithGap - 20) <= 0) ? 1 : (widthWithGap - 20));

    //CLOSE IMAGE
    if(widthWithGap >= 16)
    {
        context.drawImage(imageClose, (marginLeftWithGap + widthWithGap - 15), 0, 15, 15);
    }

    //THUMBNAIL IMAGE
    var imageThumbnail = currentElement.thumbnail;
    var sWidth, sHeight, xThumbnail, yThumbnail, widthThumbnail, heightThumbnail;

    if(currentElement.type != TYPE.AUDIO)
    {
        var newWidth = (imageThumbnail.width * 75) / imageThumbnail.height;

        sWidth = (newWidth > (widthWithGap - 7)) ? (((widthWithGap - 7) / newWidth) * imageThumbnail.width) : imageThumbnail.width;
        sHeight = imageThumbnail.height;

        xThumbnail = marginLeftWithGap + 2;
        yThumbnail = 20;

        widthThumbnail = (newWidth > (widthWithGap - 7)) ? (widthWithGap - 7) : newWidth;
        heightThumbnail = 75;

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

        sWidth = imageThumbnail.width - (ratio * currentElement.leftGap) - (ratio * currentElement.rightGap);
        sHeight = imageThumbnail.height;

        xThumbnail = marginLeftWithGap;
        yThumbnail = 20;

        widthThumbnail = widthWithGap;
        heightThumbnail = 75;

        context.drawImage(imageThumbnail, sx, sy, sWidth, sHeight, xThumbnail, yThumbnail, widthThumbnail, heightThumbnail);
    }

    if(currentElement.selected) {
        //drawTime(context, marginLeftWithGap);
    }
}

function drawTime(context, marginLeft) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'blue';
    context.moveTo(marginLeft, 100);
    context.lineTo(marginLeft, 120);
    context.stroke();

    context.fillText(pixelToTime(marginLeft), (marginLeft + 2), 115)
}