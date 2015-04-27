/**
 * Created by Dylan on 10/02/2015.
 */


/* Fonction de création d'un élément ici d'un fichier, elle prend en compte l'id du fichier, l'id de la piste. Les paramètres suivants
sont la position par rapport au début de la piste, le temps de départ au début de l'élément (il peut partir de 20 sec par exemple),
l'autorisation de l'élément à avoir un "ami" sur une autre piste (exemple avec une vidéo qui a un élément vidéo et audio si elle a du son) :
ces derniers paramètres sont utilisés lors d'une superposition d'un élément sur un autre. */

function addElementTrack(fileId, trackId, nMarginLeft, timeBegin, values, parent) {
    rLog('-ELEMENT- add [fileId: ' + fileId + '][trackId: ' + trackId + ']');

    var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

    console.log(file);

    var rowTrack1 = rowById(trackId, currentProject.tabListTracks);
    var track1 = currentProject.tabListTracks[rowTrack1];

    console.log(track1);

    console.log('duration:' + file.duration);

    var elementId = (track1.tabElements.length > 0) ? track1.tabElements[track1.tabElements.length - 1].id + 1 : 0;

    var color = randomColor();

    var marginLeft = 0;
    var time = {total: timeToSeconds(file.duration), begin: timeBegin};

    if(file.isVideo && file.isAudio && parent) {
        console.log(track1.parent);

        if(track1.parent >= 0)
        {
            console.log('both and parent');

            var rowTrack2 = rowById(track1.parent, currentProject.tabListTracks);

            marginLeft = (nMarginLeft >= 0) ? nMarginLeft : gMarginLeft((file.isVideo && file.isAudio), {row1: rowTrack1, row2: rowTrack2});

            addElement(elementId, fileId, trackId, file.type, file.thumbnail, color, marginLeft, time, values, (elementId + 1));
            addElement((elementId + 1), fileId, track1.parent, file.type, file.thumbnail, color, marginLeft, time, values, elementId);
        }
        else
        {
            console.log('no parent track');
        }
    }
    else
    {
        marginLeft = (nMarginLeft >= 0) ? nMarginLeft : gMarginLeft((file.isVideo && file.isAudio), {row1: rowTrack1, row2: -1});

        addElement(elementId, fileId, trackId, file.type, file.thumbnail, color, marginLeft, time, values, -1);
    }
}

function addElement(id, fileId, trackId, type, thumbnail, color, marginLeft, time, values, parent) {
    var rowTrack = rowById(trackId, currentProject.tabListTracks);
    var track = currentProject.tabListTracks[rowTrack];

    console.log(thumbnail);

    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        var element = new Element(id, type, imageThumbnail, color, {total: time.total, begin: time.begin}, fileId, trackId, marginLeft, ((track.type == TYPE.VIDEO) ? {opacity: 0, effects: []} : {volume: 100, effects: []}), parent);

        if(values.resize) {
            element.width = values.width;
            element.leftGap = values.leftGap;
        }

        track.tabElements.push(element);

        console.log('trackId : ' + trackId);

        drawElements(trackId);
    };

    imageThumbnail.src = ((track.type == TYPE.VIDEO) ? thumbnail.i : thumbnail.a);
}

function gMarginLeft(isVideoAudio, rows) {
    var marginLeft = 0;

    console.log('info: ' + isVideoAudio + ' - ' + rows.row1 + ' - ' + rows.row2);

    for(var i = 0; i < currentProject.tabListTracks[rows.row1].tabElements.length; i++) {
        if((currentProject.tabListTracks[rows.row1].tabElements[i].marginLeft + currentProject.tabListTracks[rows.row1].tabElements[i].width) > marginLeft) {
            marginLeft = currentProject.tabListTracks[rows.row1].tabElements[i].marginLeft + currentProject.tabListTracks[rows.row1].tabElements[i].width;
        }
    }

    if(isVideoAudio) {
        for(var x = 0; x < currentProject.tabListTracks[rows.row2].tabElements.length; x++) {
            if((currentProject.tabListTracks[rows.row2].tabElements[x].marginLeft + currentProject.tabListTracks[rows.row2].tabElements[x].width) > marginLeft) {
                marginLeft = currentProject.tabListTracks[rows.row2].tabElements[x].marginLeft + currentProject.tabListTracks[rows.row2].tabElements[x].width;
            }
        }
    }

    return marginLeft + 1;
}

function updateThumbnail(track, elementRow, thumbnail) {
    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        rLog('-ELEMENT- update video thumbnail [fileId: ' + track.fileId + '][elementId: ' + track.tabElements[elementRow].id + ']');

        track.tabElements[elementRow].thumbnail = imageThumbnail;

        drawElements(track.id);
    };

    imageThumbnail.src = thumbnail;
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

        element.color = randomColor();
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

    eId('previewElementP').innerHTML = '<a href="#" class="thumbnail"><img src="' + ((element.type != TYPE.AUDIO) ? file.thumbnail.i : file.thumbnail.a) + '" class="'+((element.type != TYPE.AUDIO) ? "previewFileContent" : "previewAudioFileContent" )+'"></a>';

    drawElementProperties(element);

    eId('totalDElementP').innerHTML = element.totalDuration + 's';
    eId('initialDElementP').innerHTML = element.currentDuration + 's';
    eId('resizeLElementP').innerHTML = element.leftGap + 'px';
    eId('resizeRElementP').innerHTML = element.rightGap + 'px';
    eId('positionElementP').innerHTML = element.marginLeft + 'px';

    $('#elementPropertiesModal').modal('show');
}

function drawElementProperties(element) {
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
}

//COLOR ELEMENT
function changeColorElement(rowTrack, rowElement) {
    rLog('-ELEMENT- change color [rowTrack: ' + rowTrack + '][rowElement: ' + rowElement + '][color: ' + eId('colorElementP').value + ']');

    var element = currentProject.tabListTracks[rowTrack].tabElements[rowElement];
    element.color = eId('colorElementP').value;

    drawElementProperties(element);
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
function volumeElementModal(id, trackId, value) {
    document.getElementById('volumeRange').value = value;
    document.getElementById('volumeRange').onchange = function()
    {
        setVolumeElement(id, trackId);
    };

    $('#volumeElementModal').modal('show');
}

function setVolumeElement(id, trackId) {
    var track = currentProject.tabListTracks[rowById(trackId, currentProject.tabListTracks)];
    var element = track.tabElements[rowById(id, track.tabElements)];

    element.properties.volume = parseInt(eId('volumeRange').value);
}

//Suppression d'un élément dans une piste avec sont élément "ami" (si il en a un)
function deleteElementModal(rowTrack, rowElement) {
    eId('buttonDeleteElement').setAttribute('onclick', 'deleteElement(' + rowTrack + ', ' + rowElement + ');');

    $('#deleteElementModal').modal('show');
}

function deleteElement(rowTrack, rowElement) {
    rLog('-ELEMENT- delete [rowTrack: ' + rowTrack + '][rowElement: ' + rowElement + ']');

    $('#deleteElementModal').modal('hide');

    var track = currentProject.tabListTracks[rowTrack];
    var parentTrack = currentProject.tabListTracks[rowById(track.parent, currentProject.tabListTracks)];

    track.currentRow = -1;

    console.log(track.tabElements[rowElement].parent);

    if(track.tabElements[rowElement].parent >= 0)
    {
        console.log('deleteParent');

        console.log(rowById(track.tabElements[rowElement].parent, parentTrack.tabElements), parentTrack.tabElements);

        parentTrack.tabElements.remove(rowById(track.tabElements[rowElement].parent, parentTrack.tabElements));
    }

    track.tabElements.remove(rowElement);

    drawElementsTracks();
}