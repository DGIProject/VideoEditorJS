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
Loader.prototype.addElement = function(element){

    var info = getInfoForFileId(element.id, null, "JSon");

    var idElement;

    if(tabListElements.length > 0)
    {
        idElement = element.id
    }
    else
    {
        idElement = 0;
    }

    var ElementToAdd = new Elements(idElement, info.fileName, info.duration, element.fileId, element.trackId);

    var actualTrack = document.getElementById("ViewTrack" + element.trackId);
    tabListTracks[element.trackId].elementsId.push(idElement);

    var htmlElement = document.createElement("div");
    htmlElement.setAttribute('class', "trackElement");
    htmlElement.innerHTML = info.fileName + " <button class='btn btn-xs removeElement' onclick='removeElementFromTrack(" + element.trackId + "," + element.id + ")'><span class='glyphicon glyphicon-remove'></span></button>";
    htmlElement.setAttribute('id', 'trackElementId' + element.id);
    htmlElement.setAttribute('onmousedown', 'prepareMoveElement(' + element.id + ')');
    htmlElement.setAttribute('onmouseup', 'stopMoveElement()');
    ElementToAdd.length = element.length;
    htmlElement.style.width = ElementToAdd.length + "px";
    htmlElement.style.cursor = 'move';
    ElementToAdd.maxLength = element.maxLength
    htmlElement.style.maxWidth = ElementToAdd.maxLength + 'px';
    document.getElementById("textViewEditor" + element.trackId).style.display = "none";

    actualTrack.appendChild(htmlElement);
    ElementToAdd.offset = element.offset
    $("#"+htmlElement.id).offset({top: $("#"+htmlElement.id).offset().top, left:element.offset});
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

    var iconeName = ""
    console.log('typeFile : ' + file.type);
    if (file.type == "text")
        iconeName = "glyphicon-text-width"
    else if (file.type == "audio")
        iconeName = "glyphicon-music"
    else if (file.type == "video")
        iconeName = "glyphicon-film"
    else
        iconeName = "glyphicon-file"
    document.getElementById('listFilesLib').innerHTML += '<a href="#" onclick="fileProperties(' + newId + ', \'' + file.type + '\');" class="list-group-item" id="libFile' + newId + '" idFile="' + newId + '"><h4 id="nameFile' + newId + '" class="list-group-item-heading"><span class="glyphicon '+iconeName+'"></span> ' + compressName(file.fileName) + '</h4><div id="divToolsFile' + newId + '"></div></a>';

}
Loader.prototype.load = function()
{
    currentProject = this.info.project;
    updateTextProject();

    files = this.info.files

    for (i=0;i<files.length;i++)
    {
        this.addFile(files[i]);
    }

    track = this.info.track;

    for (i=0;i<track.length;i++)
    {
        this.addTrack(track[i]);
    }

    elements = this.info.elements;

    for (i=0;i<elements.length;i++)
    {
        this.addElement(elements[i]);
    }

    hideLoadingDiv();
}