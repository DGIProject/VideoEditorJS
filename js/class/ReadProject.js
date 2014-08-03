Loader = function(dataLoaded)
{
    this.info = dataLoaded;
};

Loader.prototype.addTrack = function(track){
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById('VideoView');
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('div');
    newTrack.setAttribute('class', 'singleTrack');
    newTrack.setAttribute('id', 'track' + track.id);
    newTrack.innerHTML = '<div class="valuesTrack"><input type="text" onkeyup="updateNameTrack(' +  track.id + ', this.value);" class="form-control"  placeholder="Name" value="'+track.name+'"></br><input type="range" step="1" onchange="updateVolumeTrack(' +  track.id + ', this.value);" min="1" max="100" class="form-control"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="addFileTrack(' +  track.id + ');" class="btn btn-link"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' +  track.id + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' +  track.id + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
    tracks.appendChild(newTrack);

    newViewTrack.setAttribute('class', 'singleTrack');
    newViewTrack.setAttribute('style','width: 1000px;');
    newViewTrack.setAttribute('id', 'ViewTrack' +  track.id);
    newViewTrack.innerHTML = '<p id="textViewEditor' +  track.id + '" class="textViewEditor">Aucune vidéo n\'est présente dans cette piste.</p>';
    videoView.appendChild(newViewTrack);

    var track = new Track( track.id, track.name);
    tabListTracks.push(track);
}
Loader.prototype.addElement = function(elementB){


    var ElementToAdd = new Elements(elementB.id,elementB.name, elementB.initialDuration, elementB.fileId, elementB.trackId);
    ElementToAdd.id = elementB.id;
    ElementToAdd.name = elementB.name;
    ElementToAdd.initialDuration = elementB.initialDuration; // in h:m:s
    ElementToAdd.currentDuration = elementB.currentDuration;
    ElementToAdd.length = elementB.length; // in px
    ElementToAdd.maxLength = elementB.maxLength;
    ElementToAdd.marginXpx = elementB.marginXpx;
    ElementToAdd.marginXDuration = elementB.marginXDuration;
    ElementToAdd.marginXsecond = elementB.marginXsecond;
    ElementToAdd.fileId = elementB.fileId;
    ElementToAdd.startTime = elementB.startTime; //in second
    ElementToAdd.startTimePx = elementB.startTimePx;
    ElementToAdd.trackId = elementB.startTimePx;
    ElementToAdd.offset = elementB.offset;


    var actualTrack = document.getElementById("ViewTrack" + elementB.trackId);
    tabListTracks[elementB.trackId].elementsId.push(elementB.id);

    var element = document.createElement("div");
    element.setAttribute('class', "trackElement");
    element.innerHTML = elementB.name + " <button class='btn btn-xs removeElement' onclick='removeElementFromTrack(" + elementB.trackId + "," + elementB.id + ")'><span class='glyphicon glyphicon-remove'></span></button>";
    element.setAttribute('id', 'trackElementId' + elementB.id);
    element.setAttribute('onmousedown', 'prepareMoveElement(' + elementB.id + ')');
    element.setAttribute('onmouseup', 'stopMoveElement()');

    element.style.width = elementB.length + "px";
    element.style.cursor = 'move';
    element.style.maxWidth = elementB.maxLength + 'px';
    element.style.width = elementB.length + 'px';
    element.style.marginLeft = elementB.marginXpx +  'px';


    actualTrack.appendChild(element);
//    $("#"+element.id).offset({ top: $("#"+element.id).offset().top, left: elementB.offset})

    document.getElementById("textViewEditor" + elementB.trackId).style.display = "none";

    console.log('------------------',ElementToAdd.offset,'-------------------------');
    tabListElements.push(ElementToAdd);
}
Loader.prototype.addFile = function(file){

    if(tabListFiles.length > 0)
    {
        newId = tabListFiles[tabListFiles.length - 1].id + 1;
    }
    else
    {
        newId = 0;
    }


    var currentItem = new FileList(file.id, file.type, file.size, file.fileName, file.format);
    console.log('currentItem ' + currentItem);
    if (file.type = "image")
    {
        currentItem.setDuration(file.duration)
    }
    tabListFiles.push(currentItem);

    switch(file.type)
    {
        case TYPE.AUDIO :
            iconName = 'glyphicon-music';
            break;
        case TYPE.VIDEO :
            iconName = 'glyphicon-film';
            break;
        case TYPE.IMAGE :
            iconName = 'glyphicon-picture';
            break;
        default :
            iconName = 'glyphicon-file';
    }

    var fileE = document.createElement('a');
    fileE.id = 'file' + file.id;
    fileE.href = '#';
    fileE.setAttribute('fileId', file.id);
    fileE.setAttribute('onclick', 'fileProperties(' + file.id + ');');
    fileE.classList.add('list-group-item');
    fileE.innerHTML = '<h4 id="nameFile' + file.id + '" class="list-group-item-heading"><span class="glyphicon ' + iconName + '"></span> ' + compressName(file.fileName) + '</h4><div id="toolsFile' + file.id + '"></div>';

    document.getElementById('listFiles').appendChild(fileE);
}
Loader.prototype.load = function()
{

    currentProject = new Project(this.info.project.name, this.info.project.date);
    currentProject.lastSave = this.info.project.lastSave;
    currentProject.isStarted = true;
    currentProject.resetProject();


    files = this.info.files

    for (i=0;i<files.length;i++)
    {
        this.addFile(files[i]);
    }

    tracks = this.info.tracks;

    for (i=0;i<tracks.length;i++)
    {
        this.addTrack(tracks[i]);
    }

    elements = this.info.elements;

    for (i=0;i<elements.length;i++)
    {
        this.addElement(elements[i]);
    }
    $('#loadModal').modal("hide");
    currentProject.isCreated = true;
    currentProject.updateTextProject();
}