/**
 * Created by Guillaume on 29/01/14.
 */

document.getElementById("libSelectButton").style.display = "none";

var TabListFile = [];
var selectedFileID = 0;
var Fileselected = true;
var selectedTrack;
var elementList = [];
var divElementSelectedForMove, canMove = false, firstMove;
var lastPosition = {x: 0, y: 0};
var actionWorker;
var resizing = false;
var pixelCalculateTime = {g: 0, d: 800}
var context = document.getElementById('TitleRender').getContext('2d')

window.onmousemove = handleMouseMove;

var tabListTracks = [];

function addTrack() {
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById("VideoView");
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('div');
    newTrack.setAttribute("class", "singleTrack");
    newTrack.setAttribute("id", "track" + tabListTracks.length);
    newTrack.innerHTML = '<div class="valuesTrack"><input type="text" onkeyup="updateNameTrack(' + tabListTracks.length + ', this.value);" class="form-control"  placeholder="Name" value="Undefined"></br><input type="range" step="1" onchange="updateVolumeTrack(' + tabListTracks.length + ', this.value);" min="1" max="100"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="addFileTrack(' + tabListTracks.length + ');" class="btn btn-link" data-toggle="modal" data-target="#addFileTrackModal"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + tabListTracks.length + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + tabListTracks.length + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
    tracks.appendChild(newTrack);

    newViewTrack.setAttribute("class", "singleTrack sizeViewEditorTrack");
    newViewTrack.setAttribute("id", "ViewTrack" + tabListTracks.length);
    newViewTrack.innerHTML = '<p id="textViewEditor' + tabListTracks.length + '" class="textViewEditor">Aucune vidéo n\'est présente dans cette piste.</p>';
    videoView.appendChild(newViewTrack);

    var track = new Track(tabListTracks.length, 'Undefined', null);
    tabListTracks.push(track);
}
function deleteTrack(id) {
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById("VideoView");
    var trackToDelete = document.getElementById("track" + id);
    var ViewTrackToDelete = document.getElementById("ViewTrack" + id);
    videoView.removeChild(ViewTrackToDelete);
    tracks.removeChild(trackToDelete);
}
function New() {
    //numberOfTrack = 0;
    var tracks = document.getElementById('tracks');
    tracks.innerHTML = "";
    var videoView = document.getElementById("VideoView");
    videoView.innerHTML = "";
    tabListTracks = []
    elementList = []
}
function scroolAllTracks() {
    var tracks = document.getElementById("tracks"), videoTrackView = document.getElementById("VideoView");
    var positionActuelle = videoTrackView.scrollTop;
    //  console.log(positionActuelle);
    tracks.scrollTop = positionActuelle;
    videoTrackView.scrollTop = positionActuelle;
    pixelCalculateTime.g = 0 + videoTrackView.scrollLeft
    pixelCalculateTime.d = 800 + videoTrackView.scrollLeft

    calculateTimeBar();

}
function addFileTrack(id) {
    console.log('addFileTrack');

    document.getElementById("libSelectButton").setAttribute("onclick", "addElement('" + id + "')");
    document.getElementById("libSelectButton").style.display = "";


}
function prepareMoveElement(elementListID) {
    divElementSelectedForMove = document.getElementById("trackElementId" + elementList[elementListID].id);
    canMove = true;
    console.log('true!')
}
function stopMoveElement() {
    canMove = false;
    console.log('false!');
    if (parseInt(divElementSelectedForMove.style.width.replace('px', '')) <= parseInt(divElementSelectedForMove.style.maxWidth.replace('px', ''))) {
        elementList[parseInt(divElementSelectedForMove.id.replace('trackElementId', ''))].resize(parseInt(divElementSelectedForMove.style.width.replace('px', '')));
    }
    else {
        divElementSelectedForMove.style.width = divElementSelectedForMove.style.maxWidth;

    }
    elementList[parseInt(divElementSelectedForMove.id.replace('trackElementId', ''))].setMarginX(divElementSelectedForMove.style.marginLeft.replace('px', ''))
}
function settingsTrack(id) {
    console.log('deleteTrack');
}
function updateNameTrack(id, nameTrack) {
    console.log(nameTrack);
    tabListTracks[id].changeName(nameTrack);
}
function addElement(id) {

    document.getElementById("libSelectButton").setAttribute("onclick", "");
    document.getElementById('libSelectButton').style.display = 'none';

    var info = getInfoForFileId(selectedFileID, "JSon");
    var ElementToAdd = new Elements(elementList.length, info.fileName, info.duration);

    var actualTrack = document.getElementById("ViewTrack" + id);

    var element = document.createElement("div");
    element.setAttribute('class', "trackElement");
    element.innerHTML = info.fileName + " <button class='btn btn-xs removeElement' onclick='removeElementFromTrack(" + id + "," + elementList.length + ")'><span class='glyphicon glyphicon-remove'></span></button>";
    element.setAttribute('id', 'trackElementId' + elementList.length);
    element.setAttribute('onmousedown', 'prepareMoveElement(' + elementList.length + ')');
    element.setAttribute('onmouseup', 'stopMoveElement()');
    element.style.width = ElementToAdd.length + "px";
    element.style.cursor = 'move';
    element.style.maxWidth = ElementToAdd.maxLength + 'px';
    document.getElementById("textViewEditor" + id).style.display = "none";

    actualTrack.appendChild(element);
    elementList.push(ElementToAdd);
}
function addOneFile() {
    var currentFile = document.getElementById('fileLoader').files[0];
    actionWorker = "getDurationFile"
    var reader = new FileReader();

    reader.onload = function (e) {
        var data = e.target.result;

        var ElementData = new Uint8Array(data);

        worker.postMessage({
            type: "command",
            arguments: ["-i", "fileInput"],
            files: [
                {
                    "name": "fileInput",
                    "data": ElementData
                }
            ]
        });

        var currentItem = new FileList(TabListFile.length, currentFile.size, currentFile.name, currentFile.name.split('.').pop())
        console.log('currentItem ' + currentItem);
        TabListFile.push(currentItem);
        // console.log("biblioElement"+TabListFile.length-1)
        //console.log("selectBibElement("+TabListFile.length-1+")")
        var element = document.createElement('div');
        element.setAttribute('class', 'well')
        element.setAttribute('id', "biblioElement" + (TabListFile.length - 1))
        element.setAttribute('onclick', "selectBibElement(" + (TabListFile.length - 1) + ")");
        element.innerHTML = currentItem.fileName;
        document.getElementById("divListFile").appendChild(element);

        showLoadingDiv();
    }

    reader.readAsArrayBuffer(currentFile)
}
function selectBibElement(id) {
    if (Fileselected) {
        var divElementAlreadySelected = document.getElementById("biblioElement" + selectedFileID);
        divElementAlreadySelected.className = "well";
    }

    var divElementSelected = document.getElementById("biblioElement" + id);
    divElementSelected.className = "selectedFile well";
    selectedFileID = id;
    getInfoForFileId(id);
    Fileselected = true;
}
function getInfoForFileId(id, mode) {
    if (mode == "JSon") {
        return TabListFile[id];
    }
    else {
        var nameSpan = document.getElementById("selectedFileName"), sizeSpan = document.getElementById("selectedFileSize"), formatSpan = document.getElementById("selectedFileFormat"), durationSpan = document.getElementById('selectedFileDuration');
        nameSpan.innerHTML = TabListFile[id].fileName;
        sizeSpan.innerHTML = TabListFile[id].size + " Octets";
        formatSpan.innerHTML = TabListFile[id].format;
        durationSpan.innerHTML = TabListFile[id].duration;
    }

}
function removeFileFromList() {
    var toDelete = document.getElementById("biblioElement" + selectedFileID);
    var parrent = document.getElementById("divListFile");
    parrent.removeChild(toDelete);
    delete TabListFile[selectedFileID];
    Fileselected = false;

    console.log(TabListFile);
}
function handleMouseMove(event) {
    event = event || window.event; // IE-ism
    if (canMove && !resizing) {
        //  var offset = divElementSelectedForMove.offsetLeft
        // var posX = event.clientX - offset
        console.log(event.clientX, event.clientY);
        var marginText = divElementSelectedForMove.style.marginLeft;
        var newMargin = event.clientX - 400
        console.log("maegN", newMargin, marginText)
        if (newMargin >= 0 || marginText >= 0) {
            console.log('scrrol', document.getElementById("VideoView").scrollLeft);
            divElementSelectedForMove.style.marginLeft = document.getElementById("VideoView").scrollLeft + newMargin + "px";
            lastPosition.x = event.clientX
            lastPosition.y = event.clientY
        }

    }
}
function removeElementFromTrack(trackId, ElementId) {
    var track = document.getElementById('ViewTrack' + trackId);
    var elementToDelete = document.getElementById("trackElementId" + elementList[ElementId].id);
    track.removeChild(elementToDelete);
    canMove = false;
}
function showLoadingDiv() {
    console.log('showLoadingDiv');

    document.getElementById('editor').setAttribute('disabled', '');
    $('#loadingDiv').modal('show');
}
function hideLoadingDiv() {
    console.log('hideLoadingDiv');

    $('#loadingDiv').modal('hide');
    document.getElementById('editor').removeAttribute('disabled');
}
window.onmousedown = function (e) {

    lastPosition.x = e.clientX;
    lastPosition.y = e.clientY;

    console.log('ok');

}
window.onkeypress = function (e) {

    if (e.keyCode == 37) // left
    {
        document.getElementById('VideoView').scrollLeft = document.getElementById('VideoView').scrollLeft - 10
    }
    else if (e.keyCode == 39) // right
    {
        document.getElementById('VideoView').scrollLeft = document.getElementById('VideoView').scrollLeft + 10
    }
    console.log(e.keyCode, "keycode")

}
function changeZoom(zoom) {
    document.getElementById('zoomRange').value = zoom;
    oneSecond = zoom;
    console.log(oneSecond)

    calculateNewSize();
}
function zoomPlus() {
    if (parseInt(document.getElementById('zoomRange').value) < 10) {
        oneSecond = parseInt(document.getElementById('zoomRange').value) + 1;
        document.getElementById('zoomRange').value = oneSecond;
    }
    console.log(oneSecond)

    calculateNewSize();
}
function zoomMoins() {
    if (parseInt(document.getElementById('zoomRange').value) > 1) {
        oneSecond = parseInt(document.getElementById('zoomRange').value) - 1;
        document.getElementById('zoomRange').value = oneSecond;
    }
    console.log(oneSecond)
    calculateNewSize();
}
function calculateNewSize() {
    var newTime = Math.floor(800 / oneSecond);
    var minutes = Math.floor(newTime / 60);
    var second = newTime - (60 * minutes);
    calculateTimeBar();
    for (var i = 0; i < elementList.length; i++) {
        elementList[i].actualiseLenght();
        document.getElementById('trackElementId' + elementList[i].id).style.width = elementList[i].length + 'px';
        document.getElementById('trackElementId' + elementList[i].id).style.maxWidth = elementList[i].maxLength + 'px';
        document.getElementById('trackElementId' + elementList[i].id).style.marginLeft = elementList[i].marginXpx + "px"
    }
}
function calculateTimeBar() {
    var timeGauche = Math.floor(pixelCalculateTime.g / oneSecond);
    var timeDroit = Math.floor(pixelCalculateTime.d / oneSecond);
    console.log(timeDroit, timeGauche);
    // calcule du temp a droite !
    var heure = Math.floor(timeDroit / 3600)
    timeDroit = timeDroit - (3600 * heure);
    var minutes = Math.floor(timeDroit / 60)
    timeDroit = timeDroit - (60 * minutes);
    var seconde = timeDroit
    document.getElementById('endTime').innerHTML = heure + 'h' + minutes + "m" + seconde + "s";
    var heure = Math.floor(timeGauche / 3600)
    timeGauche = timeGauche - (3600 * heure);
    var minutes = Math.floor(timeGauche / 60)
    timeGauche = timeGauche - (60 * minutes);
    var seconde = timeGauche
    document.getElementById('startTime').innerHTML = heure + 'h' + minutes + "m" + seconde + "s";

}
function updateVolumeTrack(trackId, value) {
    tabListTracks[trackId].changeVolume(value);
}
function activeResize() {
    $("#btnResize").button('toggle');
    if (resizing) {
        resizing = false;
        for (i = 0; i < elementList.length; i++) {
            document.getElementById('trackElementId' + elementList[i].id).style.resize = "none";
        }
    }
    else {
        resizing = true;
        for (i = 0; i < elementList.length; i++) {
            document.getElementById('trackElementId' + elementList[i].id).style.resize = "horizontal";
        }
    }
}
window.onload = function (e) {
    calculateTimeBar();
}
function writeTextToCanvas(text) {
    context.clear();
    context.font = document.getElementById('txtSize').value + 'pt Calibri';
    var x = document.getElementById('TitleRender').width / 2;
    var y = document.getElementById('TitleRender').height / 2;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = document.getElementById('colorText').value;
    context.fillText(text, x, y);
}
function saveTitle() {

    var image = new Image();
    image.onload = function(){
        image.src = document.getElementById('TitleRender').toDataURL("image/png");
    }

    var currentItem = new FileList(TabListFile.length, 0, document.getElementById('titleName').value+'.tl', 'tl')
    console.log('currentItem ' + currentItem);
    TabListFile.push(currentItem);
    // console.log("biblioElement"+TabListFile.length-1)
    //console.log("selectBibElement("+TabListFile.length-1+")")
    var element = document.createElement('div');
    element.setAttribute('class', 'well')
    element.setAttribute('id', "biblioElement" + (TabListFile.length - 1))
    element.setAttribute('onclick', "selectBibElement(" + (TabListFile.length - 1) + ")");
    element.innerHTML = currentItem.fileName;
    document.getElementById("divListFile").appendChild(element);

}
CanvasRenderingContext2D.prototype.clear =
    CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
        if (preserveTransform) {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
        }

        this.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (preserveTransform) {
            this.restore();
        }
    };