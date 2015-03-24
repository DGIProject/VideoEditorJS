/**
 * Created by Dylan on 10/02/2015.
 */


/* Fonction de création d'un élément ici d'un fichier, elle prend en compte l'id du fichier, l'id de la piste. Les paramètres suivants
sont la position par rapport au début de la piste, le temps de départ au début de l'élément (il peut partir de 20 sec par exemple),
l'autorisation de l'élément à avoir un "ami" sur une autre piste (exemple avec une vidéo qui a un élément vidéo et audio si elle a du son) :
ces derniers paramètres sont utilisés lors d'une superposition d'un élément sur un autre. */

function addElement(id, trackId, posX, timeBegin, parent) {
    var file = currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)];

    var track = currentProject.tabListTracks[rowById(trackId, currentProject.tabListTracks)];
    var parentTrack = currentProject.tabListTracks[rowById(track.parent, currentProject.tabListTracks)];

    console.log(file);

    var id1 = (track.tabElements.length > 0) ? track.tabElements[track.tabElements.length - 1].id + 1 : 0;
    var id2 = id1 + 1;

    var marginLeft = 0;

    if(posX != undefined)
    {
        marginLeft = posX;
    }
    else
    {
        for(var i = 0; i < currentProject.tabListTracks.length; i++)
        {
            for(var x = 0; x < currentProject.tabListTracks[i].tabElements.length; x++)
            {
                marginLeft = ((currentProject.tabListTracks[i].tabElements[x].marginLeft + currentProject.tabListTracks[i].tabElements[x].width) > marginLeft) ? (currentProject.tabListTracks[i].tabElements[x].marginLeft + currentProject.tabListTracks[i].tabElements[x].width) : marginLeft;
            }
        }
    }

    var color = randomColor();

    if(file.isVideo && file.isAudio && parent)
    {
        console.log('with parent');

        elementTrack(track, id1, file.type, ((track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), color, {total: timeToSeconds(file.duration), begin: timeBegin}, id, trackId, marginLeft, ((track.type == TYPE.VIDEO) ? {opacity: 0, effects: []} : {volume: 100, effects: []}), id2);
        elementTrack(parentTrack, id2, file.type, ((parentTrack.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), color, {total: timeToSeconds(file.duration), begin: timeBegin}, id, track.parent, marginLeft, ((track.type == TYPE.VIDEO) ? {opacity: 0, effects: []} : {volume: 100, effects: []}), id1);
    }
    else
    {
        console.log('without parent');

        elementTrack(track, id1, file.type, ((track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), color, {total: timeToSeconds(file.duration), begin: timeBegin}, id, trackId, marginLeft, ((track.type == TYPE.VIDEO) ? {opacity: 0, effects: []} : {volume: 100, effects: []}), -1);
    }
}

//Ajout de chaque élément dans la piste (ref. fonction addElement)
function elementTrack(track, elementId, type, thumbnailData, color, time, fileId, trackId, marginLeft, properties, parent) {
    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        track.tabElements.push(new Element(elementId, type, imageThumbnail, color, time, fileId, trackId, marginLeft, properties, parent));

        console.log('trackId : ' + trackId);

        drawElements(trackId);
    };

    imageThumbnail.src = thumbnailData;
}

//Cette fonction permet de séparer deux éléments sur deux pistes (vidéo et audio) qui possèdent un lien (utilisé pour une vidéo)
function breakLinkElements(id, trackId) {
    var track = currentProject.tabListTracks[rowById(trackId, currentProject.tabListTracks)];
    var parentTrack = currentProject.tabListTracks[rowById(track.parent, currentProject.tabListTracks)];

    var element = track.tabElements[rowById(id, track.tabElements)];

    if(element.parent >= 0)
    {
        var parentElement = parentTrack.tabElements[rowById(element.parent, parentTrack.tabElements)];

        console.log(parentElement, element, rowById(element.parent, parentTrack.tabElements));

        parentElement.parent = -1;
        parentElement.color = randomColor();

        element.parent = -1;
    }

    drawElementsTracks();
}

//Propriétés d'un élément (disponible après le clique droit)
function elementProperties(rowTrack, rowElement) {
    console.log('elementProperties');

    var element = currentProject.tabListTracks[rowTrack].tabElements[rowElement];
    var file = currentProject.tabListFiles[rowById(element.fileId, currentProject.tabListFiles)];

    console.log(element);

    eId('fileElementP').innerHTML = file.fileName;
    eId('typeElementP').innerHTML = typeFile(file.type);
    eId('parentElementP').innerHTML = (element.parent >= 0) ? 'Oui' : 'Non';

    eId('colorElementP').value = element.color;
    eId('colorElementP').setAttribute('onchange', 'changeColorElement(' + rowTrack + ', ' + rowElement + ');');

    eId('previewElementP').innerHTML = '<a href="#" class="thumbnail"><img src="' + ((element.type != TYPE.AUDIO) ? file.thumbnail.i : file.thumbnail.a) + '" class="previewFileContent"></a>';

    var canvasCProperties = document.getElementById('canvasElementProperties');
    var contextCProperties = document.getElementById('canvasElementProperties').getContext('2d');

    contextCProperties.width = canvasCProperties.width;
    contextCProperties.height = canvasCProperties.height;

    var pixelValue = element.maxWidth / contextCProperties.width;
    var leftGap = (element.leftGap / pixelValue);
    var rightGap = (contextCProperties.width - (element.rightGap / pixelValue));

    console.log(leftGap, rightGap);

    contextCProperties.fillStyle = '#FFFFFF';
    contextCProperties.fillRect(0, 0, contextCProperties.width, contextCProperties.height);

    contextCProperties.fillStyle = element.color;
    contextCProperties.fillRect(leftGap, 0, rightGap - leftGap, contextCProperties.height);

    contextCProperties.beginPath();

    contextCProperties.fillStyle = '#4B4B4B';

    contextCProperties.moveTo(leftGap, 0);
    contextCProperties.lineTo(leftGap, contextCProperties.height);
    contextCProperties.stroke();

    contextCProperties.moveTo(rightGap, 0);
    contextCProperties.lineTo(rightGap, contextCProperties.height);
    contextCProperties.stroke();

    eId('totalDElementP').innerHTML = element.totalDuration + 's';
    eId('initialDElementP').innerHTML = element.currentDuration + 's';
    eId('resizeLElementP').innerHTML = element.leftGap + 'px';
    eId('resizeRElementP').innerHTML = element.rightGap + 'px';
    eId('positionElementP').innerHTML = element.marginLeft + 'px';

    $('#elementPropertiesModal').modal('show');
}

//COLOR ELEMENT
function changeColorElement(rowTrack, rowElement) {
    console.log(eId('colorElementP').value);
    currentProject.tabListTracks[rowTrack].tabElements[rowElement].color = eId('colorElementP').value;
}

//OPACITY
function opacityElementModal(id, trackId, name) {
    document.getElementById('opacityElement').innerHTML = name;
    document.getElementById('opacityRange').onchange = setOpacityElement(id, trackId);
    document.getElementById('opacityRangeValue').innerHTML = '0';

    $('#opacityElementModal').modal('show');
}

function setOpacityElement(id, trackId) {
    var track = currentProject.tabListTracks[rowById(trackId, currentProject.tabListTracks)];
    var element = track.tabElements[rowById(id, track.tabElements)];

    element.opacity = this.value;

    document.getElementById('opacityRangeValue').innerHTML = this.value;
}

//VOLUME
function volumeElementModal(id, trackId, name) {
    document.getElementById('volumeElement').innerHTML = name;
    document.getElementById('volumeRange').onchange = setOpacityElement(id, trackId);
    document.getElementById('volumeRangeValue').innerHTML = '0';

    $('#volumeElementValue').modal('show');
}

function setVolumeElement(id, trackId) {
    var track = currentProject.tabListTracks[rowById(trackId, currentProject.tabListTracks)];
    var element = track.tabElements[rowById(id, track.tabElements)];

    element.volume = this.value;

    document.getElementById('volumeRangeValue').innerHTML = this.value;
}

//Suppression d'un élément dans une piste avec sont élément "ami" (si il en a un)
function deleteElement(rowTrack, rowElement) {
    var track = currentProject.tabListTracks[rowTrack];
    var parentTrack = currentProject.tabListTracks[rowById(track.parent, currentProject.tabListTracks)];

    console.log(track.tabElements[rowElement].parent);

    if(track.tabElements[rowElement].parent >= 0)
    {
        console.log('deleteParent');

        console.log(rowById(track.tabElements[rowElement].parent, parentTrack.tabElements), parentTrack.tabElements);

        parentTrack.tabElements.remove(rowById(track.tabElements[rowElement].parent, parentTrack.tabElements));
    }

    track.tabElements.remove(rowElement);
}