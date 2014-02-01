/**
 * Created by Guillaume on 29/01/14.
 */

var numberOfTrack = 0;
var TabListFile = [];
var selectedFileID = 0;
var Fileselected = true;

function addTrack()
{
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById("VideoView");
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('div');
    numberOfTrack++;
    newTrack.setAttribute("class","singleTrack");
    newTrack.setAttribute("id","track" + numberOfTrack);
    newTrack.innerHTML = '<div class="valuesTrack"><input type="text" onkeypress="updateNameTrack(' + numberOfTrack + ', this.value);" class="form-control"  placeholder="Name"></br><input type="range" onchange="updateVolumeTrack(' + numberOfTrack + ', this.value);" min="1" max="100"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="addFileTrack(' + numberOfTrack + ');" class="btn btn-link" data-toggle="modal" data-target="#addFileTrackModal"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + numberOfTrack + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + numberOfTrack + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
    tracks.appendChild(newTrack);

    newViewTrack.setAttribute("class","singleTrack sizeViewEditorTrack");
    newViewTrack.setAttribute("id","ViewTrack" + numberOfTrack);
    newViewTrack.innerHTML = '<p class="textViewEditor">Aucune vidéo n\'est présente dans cette piste.</p>';
    videoView.appendChild(newViewTrack);
}

function deleteTrack(id)
{
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById("VideoView");
    var trackToDelete = document.getElementById("track"+id);
    var ViewTrackToDelete = document.getElementById("ViewTrack"+id);
    videoView.removeChild(ViewTrackToDelete);
    tracks.removeChild(trackToDelete);
}

function New()
{
    numberOfTrack = 0;
    var tracks = document.getElementById('tracks');
    tracks.innerHTML ="";
    var videoView = document.getElementById("VideoView");
    videoView.innerHTML = "";
}

function scroolAllTracks()
{
    var tracks = document.getElementById("tracks"), videoTrackView = document.getElementById("VideoView");
    var positionActuelle = videoTrackView.scrollTop;
    console.log(positionActuelle);
    tracks.scrollTop = positionActuelle;
    videoTrackView.scrollTop = positionActuelle;
}

function generateTimetick()
{
    var timediv = document.getElementById('time');

}

function addFileTrack(id)
{
    console.log('addFileTrack');
}

function settingsTrack(id)
{
    console.log('deleteTrack');
}

function updateNameTrack(id, nameTrack)
{
    console.log(nameTrack);
}

function addOneFile()
{
    var currentFile = document.getElementById('fileLoader').files[0];
    var currentItem = new FileList(TabListFile.length,currentFile.size, currentFile.name, currentFile.name.split('.').pop())
    console.log(currentItem);
    TabListFile.push(currentItem);
   // console.log("biblioElement"+TabListFile.length-1)
    //console.log("selectBibElement("+TabListFile.length-1+")")
    var element =  document.createElement('div');
    element.setAttribute('class','well')
    element.setAttribute('id',"biblioElement"+(TabListFile.length-1))
    element.setAttribute('onclick', "selectBibElement("+ (TabListFile.length-1) + ")");
    element.innerHTML = currentItem.fileName;
    document.getElementById("divListFile").appendChild(element);


}
function selectBibElement(id)
{
    if (Fileselected)
    {
        var divElementAlreadySelected = document.getElementById("biblioElement"+selectedFileID);
        divElementAlreadySelected.className = "well";
    }

    var divElementSelected = document.getElementById("biblioElement"+id);
    divElementSelected.className = "selectedFile well";
    selectedFileID = id;
    getInfoForFileId(id);
    Fileselected = true;
}
function getInfoForFileId(id)
{
    var nameSpan = document.getElementById("selectedFileName"), sizeSpan = document.getElementById("selectedFileSize"), formatSpan = document.getElementById("selectedFileFormat");
    nameSpan.innerHTML = TabListFile[id].fileName;
    sizeSpan.innerHTML = TabListFile[id].size + " Octets";
    formatSpan.innerHTML = TabListFile[id].format;
}
function removeFileFromList()
{
    var toDelete = document.getElementById("biblioElement"+selectedFileID);
    var parrent = document.getElementById("divListFile");
    parrent.removeChild(toDelete);
    delete TabListFile[selectedFileID]
    Fileselected = false;
}
