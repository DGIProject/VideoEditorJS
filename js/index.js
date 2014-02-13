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
window.onmousemove = handleMouseMove;

var tabListTracks = [];

function addTrack() {
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById("VideoView");
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('div');
    newTrack.setAttribute("class", "singleTrack");
    newTrack.setAttribute("id", "track" + tabListTracks.length);
    newTrack.innerHTML = '<div class="valuesTrack"><input type="text" onkeypress="updateNameTrack(' + tabListTracks.length + ', this.value);" class="form-control"  placeholder="Name" value="Undefined"></br><input type="range" onchange="updateVolumeTrack(' + tabListTracks.length + ', this.value);" min="1" max="100"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="addFileTrack(' + tabListTracks.length + ');" class="btn btn-link" data-toggle="modal" data-target="#addFileTrackModal"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + tabListTracks.length + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + tabListTracks.length + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
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
    numberOfTrack = 0;
    var tracks = document.getElementById('tracks');
    tracks.innerHTML = "";
    var videoView = document.getElementById("VideoView");
    videoView.innerHTML = "";
}
function scroolAllTracks() {
    var tracks = document.getElementById("tracks"), videoTrackView = document.getElementById("VideoView");
    var positionActuelle = videoTrackView.scrollTop;
    //  console.log(positionActuelle);
    tracks.scrollTop = positionActuelle;
    videoTrackView.scrollTop = positionActuelle;
}
function generateTimetick() {
    var timediv = document.getElementById('time');

}
function addFileTrack(id) {
    console.log('addFileTrack');

    document.getElementById("libSelectButton").setAttribute("onclick", "addElement('" + id + "')");
    document.getElementById("libSelectButton").style.display = "";


}
function prepareMoveElement(elementListID) {
    divElementSelectedForMove = document.getElementById("trackElementId"+elementList[elementListID].id);
    if (canMove) {

        canMove = false;
    }
    else {
        canMove = true;
    }
    console.log('moveOk');

}
function settingsTrack(id) {
    console.log('deleteTrack');
}
function updateNameTrack(id, nameTrack) {
    console.log(nameTrack);
}
function addElement(id) {


    document.getElementById("libSelectButton").setAttribute("onclick", "");

    var info = getInfoForFileId(selectedFileID, "JSon");
    var ElementToAdd = new Elements(elementList.length,info.fileName,info.duration);

    var actualTrack = document.getElementById("ViewTrack" + id);

    var element = document.createElement("div");
    element.setAttribute('class', "trackElement");
    element.innerHTML = info.fileName + " <button class='btn btn-xs removeElement' onclick='removeElementFromTrack(" + id + "," + elementList.length + ")'><span class='glyphicon glyphicon-remove'></span></button>";
    element.setAttribute('id', 'trackElementId' + elementList.length);
    element.setAttribute('onclick', 'prepareMoveElement(' + elementList.length + ')');
    element.style.width = ElementToAdd.length+"px";

    document.getElementById("textViewEditor" + id).style.display = "none";

    actualTrack.appendChild(element);
    elementList.push(ElementToAdd);
}
function addOneFile() {
    var currentFile = document.getElementById('fileLoader').files[0];
    actionWorker = "getDurationFile"
    var reader = new FileReader();

    reader.onload = function(e){
        var data  = e.target.result;

       var ElementData = new Uint8Array(data);

        worker.postMessage({
            type: "command",
            arguments: ["-i","fileInput"],
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
    if (canMove) {
        //  var offset = divElementSelectedForMove.offsetLeft
        // var posX = event.clientX - offset
        console.log(event.clientX, event.clientY);
        var marginText = divElementSelectedForMove.style.marginLeft;
        var newMargin = event.clientX - 340
        console.log("maegN", newMargin, marginText)
        if (newMargin >= 0 || marginText >= 0) {
            console.log('scrrol', document.getElementById("VideoView").scrollLeft);
            divElementSelectedForMove.style.marginLeft = document.getElementById("VideoView").scrollLeft + newMargin + "px";
            lastPosition.x = event.clientX
            lastPosition.y = event.clientY
            firstMove = false;
        }

    }
}
function removeElementFromTrack(trackId, ElementId) {
   var track = document.getElementById('ViewTrack'+trackId);
   var elementToDelete = document.getElementById("trackElementId"+elementList[ElementId].id);
   track.removeChild(elementToDelete);
    canMove = false;
    firstMove = true;
}

function showLoadingDiv()
{
    console.log('showLoadingDiv');

    document.getElementById('editor').setAttribute('disabled', '');
    $('#loadingDiv').modal('show');
}

function hideLoadingDiv()
{
    console.log('hideLoadingDiv');

    $('#loadingDiv').modal('hide');
    document.getElementById('editor').removeAttribute('disabled');
}

function videothequeClick()
{
    document.getElementById('libSelectButton').style.display = 'none';
}

window.onclick = function (e) {

    lastPosition.x = e.clientX;
    lastPosition.y = e.clientY;
    if (e.target.className != "btn btn-xs removeElement" ) // Si la selection est diferente de la classe du bouton remove
    {
        if (!firstMove) {
        canMove = false;
        firstMove = true;
        }
    }
    else
    {
        canMove = false;
    }

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
function changeZoom(zoom)
{
    document.getElementById('zoomRange').value = zoom;
    oneSecond = zoom;

    calculateNewSize();
}
function zoomPlus()
{
    if (document.getElementById('zoomRange').value < 10)
    {
        document.getElementById('zoomRange').value = document.getElementById('zoomRange').value + 1;
        oneSecond = document.getElementById('zoomRange').value;
    }

    calculateNewSize();
}
function zoomMoins()
{
    if (document.getElementById('zoomRange').value > 0)
    {
        document.getElementById('zoomRange').value = document.getElementById('zoomRange').value - 1;
        oneSecond = document.getElementById('zoomRange').value;
    }

    calculateNewSize();
}
function calculateNewSize()
{
    var  newTime = Math.floor( 800/oneSecond);
    var minutes = Math.floor(newTime/60);
    var second  = newTime-(60*minutes);

    document.getElementById('endTime').innerHTML = minutes+"m"+second+"s";

    for(var i = 0; i < elementList.length; i++)
    {
        elementList[i].actualiseLenght();

        document.getElementById('trackElementId'+elementList[i].id).width = elementList[i].length +'px';
        document.getElementById('trackElementId'+elementList[i].id).maxWidth = elementList[i].length +'px';
    }
}