var tabListFiles = [];
var tabListTracks = [];
var tabListElements = [];
var tabListTextElements = [];
var divElementSelectedForMove = {id: null, Object: null, trackId: null, elementListID: null}, canMove = false;
var lastPosition = {x: 0, y: 0};
var actionWorker;
var resizing = false;
var pixelCalculateTime = {g: 0, d: 800};
var context = document.getElementById('textRender').getContext('2d');
var posX, posY;
var renderVar;
var errorId = 0;

window.onmousemove = handleMouseMove;

//PROJECT

function newProject()
{
    //numberOfTrack = 0;
    var tracks = document.getElementById('tracks');
    tracks.innerHTML = "";
    var videoView = document.getElementById("VideoView");
    videoView.innerHTML = "";
    tabListTracks = [];
    tabListElements = [];

    stopAddFileToTrack();
}
//FILE

function addMultimediaFile()
{
    stopAddFileToTrack();

    var currentFile = document.getElementById('fileLoader').files[0];
    console.log(currentFile);

    var typeFile = getTypeFile(currentFile.name);
    console.log(typeFile);

    if(typeFile != 'error')
    {
        var newId;

        if(tabListFiles.length > 0)
        {
            newId = tabListFiles[tabListFiles.length - 1].id + 1;
        }
        else
        {
            newId = 0;
        }

        if(typeFile == 'image')
        {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;
                var ElementData = new Uint8Array(data);

                var currentItem = new FileList(newId, typeFile, currentFile.size, currentFile.name, currentFile.name.split('.').pop(), ElementData);
                currentItem.setDuration('00:00:20');

                tabListFiles.push(currentItem);
            }

            reader.readAsArrayBuffer(currentFile);
        }
        else
        {
            actionWorker = "getDurationFile";
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

                var currentItem = new FileList(newId, typeFile, currentFile.size, currentFile.name, currentFile.name.split('.').pop(), ElementData);
                console.log('currentItem ' + currentItem);
                tabListFiles.push(currentItem);
            }

            reader.readAsArrayBuffer(currentFile);

            showLoadingDiv();
        }
        var iconeName = ""
        console.log('typeFile : ' + typeFile);
        if (typeFile == "text")
        iconeName = "glyphicon-text-width"
        else if (typeFile == "audio")
        iconeName = "glyphicon-music"
        else if (typeFile == "video")
        iconeName = "glyphicon-film"
        else
        iconeName = "glyphicon-file"

        document.getElementById('listFilesLib').innerHTML += '<a href="#" onclick="fileProperties(' + newId + ', \'' + typeFile + '\');" class="list-group-item" id="libFile' + newId + '" idFile="' + newId + '"><h4 id="nameFile' + newId + '" class="list-group-item-heading"><span class="glyphicon '+iconeName+'"></span> ' + currentFile.name + '</h4></a>';

        var fd = new FormData();
        fd.append('uf', currentFile);
        var xhr = new XMLHttpRequest();
        xhr.file = currentFile; // not necessary if you create scopes like this
        xhr.addEventListener('progress', function(e) {

            var done = e.position || e.loaded,
                total = e.totalSize || e.total;
            console.log('xhr progress: ' + (Math.floor(done / total * 1000) / 10) + '%');

        }, false);
        if (xhr.upload) {
            xhr.upload.onprogress = function(e) {
                var done = e.position || e.loaded,
                    total = e.totalSize || e.total;

                console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');
            };
        }
        xhr.onreadystatechange = function(e) {
            if (4 == this.readyState) {
                console.log('xhr upload complete ' + this.responseText);
                if (this.responseText != "success") {
                    alert("Une erreur est surevenue !  Veuillez réessayer en cliquant de nouveau sur le bouton envoyer");
                }
            }
        };
        xhr.open('post', "http://clangue.net/testVideo/uploadFile.php?w=19&u=AZE&fileID="+newId, true);
        xhr.send(fd);
    }
    else
    {
        console.log('error');

        showError('error', 'Votre extension n\'est pas compatible avec VideoEditorJS.');
    }
}

function getTypeFile(fileName)
{
    console.log(fileName);

    var extension = fileName.split('.').reverse()[0];
    console.log(extension);

    var tabExtensionAudio = ['mp3', 'wav','wmv'];
    var tabExtensionVideo = ['avi', 'mp4','wma','flv'];
    var tabExtensionImage = ['png', 'jpg', 'jpeg','gif'];

    if(tabExtensionAudio.lastIndexOf(extension.toLowerCase()) != -1)
    {
        return 'audio';
    }
    else if(tabExtensionVideo.lastIndexOf(extension.toLowerCase()) != -1)
    {
        return 'video';
    }
    else if(tabExtensionImage.lastIndexOf(extension.toLowerCase()) != -1)
    {
        return 'image';
    }
    else
    {
        return 'error';
    }
}

function newTextElement()
{
    console.log('newTextElement');

    stopAddFileToTrack();

    $('#fileTextModal').modal('show');

    context.clear();

    document.getElementById('nameText').value = '';
    document.getElementById('contentText').value = '';
    document.getElementById('colorText').value = '';
    document.getElementById('sizeText').value = 20;

    document.getElementById('saveTextElementButton').setAttribute('disabled', '');
    document.getElementById('saveTextElementButton').setAttribute('onclick', 'saveTextElement();');

    posX = document.getElementById('textRender').width / 2;
    posY = document.getElementById('textRender').height / 2;
}

function writeTextToCanvas(x, y)
{
    var contentText = document.getElementById('contentText').value;

    context.clear();
    context.font = document.getElementById('sizeText').value + 'pt Calibri';

    posX = posX + x;
    posY = posY + y;

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = document.getElementById('colorText').value;
    context.fillText(contentText, posX, posY);

    verifyFieldTextElement();
}

function verifyFieldTextElement()
{
    var nameText = document.getElementById('nameText').value;
    var contentText = document.getElementById('contentText').value;

    if(nameText != '' && contentText != '')
    {
        document.getElementById('saveTextElementButton').removeAttribute('disabled');
    }
    else
    {
        document.getElementById('saveTextElementButton').setAttribute('disabled', '');
    }
}

function saveTextElement()
{
    var image = new Image();
    image.src = document.getElementById('textRender').toDataURL("image/png");
    var newId;

    if(tabListFiles.length > 0)
    {
        newId = tabListFiles[tabListFiles.length - 1].id + 1;
    }
    else
    {
        newId = 0;
    }

    var nameText = document.getElementById('nameText').value;
    var contentText = document.getElementById('contentText').value;
    var colorText = document.getElementById('colorText').value;
    var sizeText = document.getElementById('sizeText').value;

    var currentTextElement = new TextElement(newId, nameText, contentText, colorText, sizeText, {x: posX, y: posY});
    tabListTextElements.push(currentTextElement);

    var arrayBuffer = base64ToArrayBuffer(image.src.replace(/^data:image\/(png|jpg);base64,/, ""));
    console.log(new Uint8Array(arrayBuffer))
    var currentItem = new FileList(newId, 'text', 0, nameText, 'tl', new Uint8Array(arrayBuffer));
    currentItem.setDuration('00:00:20');

    console.log('currentItem ' + currentItem);
    tabListFiles.push(currentItem);

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', "uploadPngTitle.php?w=19&u=AZE", true);
    OAjax.onreadystatechange = function() {
        if (OAjax.readyState == 4 && OAjax.status == 200) {
            console.log(OAjax.responseText);

            if (OAjax.responseText == 'true') {
                location.href = 'index';
            }
        }
    }

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send("imageDataURL=" + document.getElementById('textRender').toDataURL("image/png") + "&nameID=" + newId);

    document.getElementById('listFilesLib').innerHTML += '<a href="#" onclick="fileProperties(' + newId + ', \'text\');" class="list-group-item" id="libFile' + newId + '" idFile="' + newId + '"><h4 id="nameFile' + newId + '" class="list-group-item-heading"><span class="glyphicon glyphicon-text-width"></span> ' + nameText + '</h4></a>';
}
function base64ToArrayBuffer(string_base64) {
    var binary_string = window.atob(string_base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        var ascii = binary_string.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
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

function fileProperties(id, type)
{
    console.log('fileProperties');

    $('#selectFileLib').modal('show');

    if(type == 'text')
    {
        document.getElementById('fileEditButton').setAttribute('onclick', 'editFileText(' + id + ');');
        document.getElementById('fileEditButton').style.display = '';
    }
    else if(type == 'image')
    {
        document.getElementById('fileEditButton').setAttribute('onclick', 'editFileImage(' + id + ');');
        document.getElementById('fileEditButton').style.display = '';
    }
    else
    {
        document.getElementById('fileEditButton').removeAttribute('onclick');
        document.getElementById('fileEditButton').style.display = 'none';
    }

    document.getElementById('fileRemoveButton').setAttribute('onclick', 'removeFile(' + id + ');');

    getInfoForFileId(id, type);
}

function getInfoForFileId(id, type, mode)
{
    if (mode == "JSon")
    {
        return tabListFiles[id];
    }
    else
    {
        console.log('yes');
        console.log(tabListFiles[id].fileName);

        document.getElementById('libFileName').innerHTML = tabListFiles[id].fileName;
        document.getElementById('libFileSize').innerHTML = tabListFiles[id].size + ' Octets';
        document.getElementById('libFileFormat').innerHTML = tabListFiles[id].format;
        document.getElementById('libFileDuration').innerHTML = tabListFiles[id].duration;

        var preview;

        if(type == 'image' || type == 'text')
        {
            preview = '<img class="previewFileContent" src="' + window.URL.createObjectURL(new Blob([tabListFiles[id].data])) + '">';
        }
        else
        {
            preview = 'Non disponible';
        }

        document.getElementById('libFilePreview').innerHTML = preview;
    }
}

function editFileText(id)
{
    $('#fileTextModal').modal('show');

    var posTabListTextElements = 0;

    for(var i = 0; i < tabListTextElements.length; i++)
    {
        if(tabListTextElements[i].id == id)
        {
            posTabListTextElements = i;
        }
    }

    document.getElementById('saveTextElementButton').setAttribute('onclick', 'saveEditFileText(' + id + ')');

    document.getElementById('nameText').value = tabListTextElements[posTabListTextElements].nameText;
    document.getElementById('contentText').value = tabListTextElements[posTabListTextElements].contentText;
    document.getElementById('colorText').value = tabListTextElements[posTabListTextElements].colorText;
    document.getElementById('sizeText').value = tabListTextElements[posTabListTextElements].sizeText;

    posX = tabListTextElements[posTabListTextElements].posText.x;
    posY = tabListTextElements[posTabListTextElements].posText.y;

    context.clear();

    writeTextToCanvas(0, 0);
}

function saveEditFileText(id)
{
    console.log('saveEditFileText');

    var posTabListFiles = 0, posTabListTextElements = 0;

    for(var i = 0; i < tabListFiles.length; i++)
    {
        if(tabListFiles[i].id == id)
        {
            posTabListFiles = i;
        }
    }

    for(var x = 0; x < tabListTextElements.length; x++)
    {
        if(tabListTextElements[x].id == id)
        {
            posTabListTextElements = x;
        }
    }

    var image = new Image();
    image.src = document.getElementById('textRender').toDataURL('image/png');

    var nameText = document.getElementById('nameText').value;
    var contentText = document.getElementById('contentText').value;
    var colorText = document.getElementById('colorText').value;
    var sizeText = document.getElementById('sizeText').value;
    var posText = {x: posX, y: posY};

    tabListFiles[posTabListFiles].setData(image.src);
    tabListTextElements[posTabListTextElements].updateValuesElement(nameText, contentText, colorText, sizeText, posText);

    document.getElementById('nameFile' + id).innerHTML = nameText;
}

function editFileImage(id)
{
    console.log('editFileImage');
}

function removeFile(id)
{
    $('#selectFileLib').modal('hide');

    var toDelete = document.getElementById('libFile' + id);
    var parent = document.getElementById('listFilesLib');
    parent.removeChild(toDelete);

    for(var i = 0; i < tabListFiles.length; i++)
    {
        if(tabListFiles[i].id == id)
        {
            tabListFiles.remove(i);
        }
    }

    console.log(tabListFiles);
}

//TRACK

function addTrack()
{
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById('VideoView');
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('div');
    newTrack.setAttribute('class', 'singleTrack');
    newTrack.setAttribute('id', 'track' + tabListTracks.length);
    newTrack.innerHTML = '<div class="valuesTrack"><input type="text" onkeyup="updateNameTrack(' + tabListTracks.length + ', this.value);" class="form-control"  placeholder="Name" value="Undefined"></br><input type="range" step="1" onchange="updateVolumeTrack(' + tabListTracks.length + ', this.value);" min="1" max="100" class="form-control"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="addFileTrack(' + tabListTracks.length + ');" class="btn btn-link"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + tabListTracks.length + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + tabListTracks.length + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
    tracks.appendChild(newTrack);

    newViewTrack.setAttribute('class', 'singleTrack');
    newViewTrack.setAttribute('style','width: 1000px;');
    newViewTrack.setAttribute('id', 'ViewTrack' + tabListTracks.length);
    newViewTrack.innerHTML = '<p id="textViewEditor' + tabListTracks.length + '" class="textViewEditor">Aucune vidéo n\'est présente dans cette piste.</p>';
    videoView.appendChild(newViewTrack);

    var track = new Track(tabListTracks.length, 'Undefined');
    tabListTracks.push(track);
}

function deleteTrack(id)
{
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById('VideoView');
    var trackToDelete = document.getElementById('track' + id);
    var ViewTrackToDelete = document.getElementById('ViewTrack' + id);
    videoView.removeChild(ViewTrackToDelete);
    tracks.removeChild(trackToDelete);

    tabListTracks[id] = 0;

    stopAddFileToTrack();
}

function updateNameTrack(id, nameTrack)
{
    console.log(nameTrack);

    tabListTracks[id].changeName(nameTrack);
}

function updateVolumeTrack(id, valueVolume)
{
    console.log('updateVolumeTrack');

    tabListTracks[id].changeVolume(valueVolume);
}

function addFileTrack(id)
{
    console.log('addFileTrack');

    document.getElementById('stopAddFileToTrackButton').style.display = '';

    var listFilesLib = document.getElementById('listFilesLib');
    var filesTab = listFilesLib.getElementsByTagName('a');

    for(var i = 0; i < filesTab.length; i++)
    {
        var idFile = filesTab[i].getAttribute('idFile');

        filesTab[i].removeAttribute('onclick');
        filesTab[i].setAttribute('onclick', 'addElement(' + idFile + ', ' + id + ');');

        filesTab[i].classList.add('active');
    }
}

function settingsTrack(id)
{
    console.log('settingsTrack');
}

function stopAddFileToTrack()
{
    document.getElementById('stopAddFileToTrackButton').style.display = 'none';

    var listFilesLib = document.getElementById('listFilesLib');
    var filesTab = listFilesLib.getElementsByTagName('a');

    for(var i = 0; i < filesTab.length; i++)
    {
        var idFile = filesTab[i].getAttribute('idFile');

        filesTab[i].removeAttribute('onclick');
        filesTab[i].setAttribute('onclick', 'fileProperties(' + idFile + ');');

        filesTab[i].classList.remove('active');
    }
}

function removeElementFromTrack(trackId, ElementId)
{
    var iterationForElementId
    for (i=0; i< tabListElements.length;i++)
    {
        if (tabListElements[i].id == ElementId)
        {
            iterationForElementId = i;
        }
    }

    var track = document.getElementById('ViewTrack' + trackId);
    var elementToDelete = document.getElementById("trackElementId" + tabListElements[iterationForElementId].id);
    track.removeChild(elementToDelete);
    tabListElements.remove(iterationForElementId);

    canMove = false;

    tabListTracks[trackId].elementsId.remove(tabListTracks[trackId].elementsId.lastIndexOf(ElementId));

}

Array.prototype.remove = function(from, to) { var rest = this.slice((to || from) + 1 || this.length); this.length = from < 0 ? this.length + from : from; return this.push.apply(this, rest); };


//SCROLL

function scroolAllTracks()
{
    var tracks = document.getElementById("tracks"), videoTrackView = document.getElementById("VideoView");
    var positionActuelle = videoTrackView.scrollTop;
    //  console.log(positionActuelle);
    tracks.scrollTop = positionActuelle;
    videoTrackView.scrollTop = positionActuelle;
    pixelCalculateTime.g = 0 + videoTrackView.scrollLeft;
    pixelCalculateTime.d = 800 + videoTrackView.scrollLeft;

    for(var i = 0; i < tabListTracks.length; i++)
    {
        if(tabListTracks[i] != 0)
        {
            document.getElementById('ViewTrack' + i).style.width = pixelCalculateTime.d + 'px';
        }
    }

    calculateTimeBar();
}

function prepareMoveElement(elementListID)
{
    divElementSelectedForMove.elementListID = elementListID;
    divElementSelectedForMove.id = tabListElements[elementListID].id;
    divElementSelectedForMove.trackId = tabListElements[elementListID].trackId;
    divElementSelectedForMove.Object = document.getElementById("trackElementId" + tabListElements[elementListID].id);
    canMove = true;
    console.log('true!')
}

function stopMoveElement()
{
    canMove = false;
    console.log('false!');
    if (parseInt(divElementSelectedForMove.Object.style.width.replace('px', '')) <= parseInt(divElementSelectedForMove.Object.style.maxWidth.replace('px', ''))) {
        tabListElements[parseInt(divElementSelectedForMove.Object.id.replace('trackElementId', ''))].resize(parseInt(divElementSelectedForMove.Object.style.width.replace('px', '')),parseInt(divElementSelectedForMove.Object.offsetLeft));
    }
    else {
        divElementSelectedForMove.Object.style.width = divElementSelectedForMove.Object.style.maxWidth;

    }
    tabListElements[parseInt(divElementSelectedForMove.Object.id.replace('trackElementId', ''))].setMarginX(divElementSelectedForMove.Object.style.marginLeft.replace('px', ''))
}

function addElement(id, idTrack)
{
    var info = getInfoForFileId(id, null, "JSon");

    var idElement;

    if(tabListElements.length > 0)
    {
        idElement = tabListElements[tabListElements.length-1].id + 1;
    }
    else
    {
        idElement = 0;
    }

    var ElementToAdd = new Elements(idElement, info.fileName, info.duration, id, idTrack);

    var actualTrack = document.getElementById("ViewTrack" + idTrack);
    tabListTracks[idTrack].elementsId.push(idElement);

    var element = document.createElement("div");
    element.setAttribute('class', "trackElement");
    element.innerHTML = info.fileName + " <button class='btn btn-xs removeElement' onclick='removeElementFromTrack(" + idTrack + "," + tabListElements.length + ")'><span class='glyphicon glyphicon-remove'></span></button>";
    element.setAttribute('id', 'trackElementId' + tabListElements.length);
    element.setAttribute('onmousedown', 'prepareMoveElement(' + tabListElements.length + ')');
    element.setAttribute('onmouseup', 'stopMoveElement()');
    element.style.width = ElementToAdd.length + "px";
    element.style.cursor = 'move';
    element.style.maxWidth = ElementToAdd.maxLength + 'px';
    document.getElementById("textViewEditor" + idTrack).style.display = "none";

    actualTrack.appendChild(element);
    ElementToAdd.offset = $("#"+element.id).offset().left
    console.log('------------------',ElementToAdd.offset,'-------------------------');
    tabListElements.push(ElementToAdd);
}
function newRecord()
{
    stopAddFileToTrack();

    document.getElementById('chooseRecordButtons').style.display = '';
    document.getElementById('videoRecord').style.display = 'none';
    document.getElementById('audioRecord').style.display = 'none';
    document.getElementById('saveRecordButton').style.display = 'none';

    document.getElementById('saveRecordButton').setAttribute('disabled', '');

    $('#recordAudioOrVideoElement').modal('show');
}

function chooseVideoRecord()
{
    document.getElementById('videoRecord').style.display = '';
    document.getElementById('saveRecordButton').style.display = '';
    document.getElementById('audioRecord').style.display = 'none';
    document.getElementById('chooseRecordButtons').style.display = 'none';
}

function chooseAudioRecord()
{
    document.getElementById('audioRecord').style.display = '';
    document.getElementById('saveRecordButton').style.display = '';
    document.getElementById('videoRecord').style.display = 'none';
    document.getElementById('chooseRecordButtons').style.display = 'none';
}

function handleMouseMove(event) {
    event = event || window.event; // IE-ism
    if (canMove && !resizing) {
        //  var offset = divElementSelectedForMove.offsetLeft
        // var posX = event.clientX - offset
      /*  console.log(event.clientX, event.clientY);
        var marginText = divElementSelectedForMove.style.marginLeft;
        var newMargin = event.clientX - 400;
        console.log("maegN", newMargin, marginText);
        if (newMargin >= 0 || marginText >= 0) {
            console.log('scrrol', document.getElementById("VideoView").scrollLeft);
            divElementSelectedForMove.style.marginLeft = document.getElementById("VideoView").scrollLeft + newMargin + "px";
            lastPosition.x = event.clientX;
            lastPosition.y = event.clientY;
        }*/

        console.log(divElementSelectedForMove)
        var elementsIdCurrentTrack = tabListTracks[divElementSelectedForMove.trackId].elementsId;
        console.log(elementsIdCurrentTrack)
        var posInTabListElements = elementsIdCurrentTrack.lastIndexOf(divElementSelectedForMove.elementListID)
        var elementIdFinded = elementsIdCurrentTrack[posInTabListElements]
        console.log(elementIdFinded, "Nous avons trouvé !!!!")
        var offsetWindow = $("#VideoView").offset().left
        if (posInTabListElements > 0)
        {
            var beforElement = $("#trackElementId"+parseInt(posInTabListElements-1));
            console.log(beforElement.offset().left, event.clientX)
            var extremitBeforElementOffset = beforElement.offset().left + beforElement.width();
            console.log("extremit = ", extremitBeforElementOffset)
			var offsetElement = divElementSelectedForMove.Object.offsetLeft
            var actualMargin = divElementSelectedForMove.Object.style.marginLeft.replace('px','');
            var positionInEditAeraX = event.clientX - extremitBeforElementOffset - divElementSelectedForMove.Object.style.width.replace('px','')/2 - document.getElementById("VideoView").scrollLeft;
            console.log("margin basique", actualMargin, offsetElement, positionInEditAeraX)

/*             var beforElement = $("#trackElementId"+parseInt(elementIdFinded-1));
            var sizetoRemove = beforElement.position().left + beforElement.width()
            var positionInEditAeraX = event.clientX - (offsetWindow )  + ($(divElementSelectedForMove.Object.id).width()/2);
            console.log("margin calculated !", sizetoRemove, offsetWindow, positionInEditAeraX, beforElement.position().left);

            var currentLenthTrack = document.getElementById('ViewTrack'+divElementSelectedForMove.trackId).style.width.replace('px',''); */
        }
        else
        {
            var offsetElement = divElementSelectedForMove.Object.offsetLeft
            var actualMargin = divElementSelectedForMove.Object.style.marginLeft.replace('px','');
            var positionInEditAeraX = event.clientX - offsetWindow  - divElementSelectedForMove.Object.style.width.replace('px','')/2;
            console.log("margin basique", actualMargin, offsetElement, positionInEditAeraX)
        }
        if (actualMargin >= 0 || positionInEditAeraX >= 0)
        {
            divElementSelectedForMove.Object.style.marginLeft = document.getElementById("VideoView").scrollLeft + positionInEditAeraX + "px";
        }


    }
}

function showLoadingDiv()
{
    console.log('showLoadingDiv');

    $('#loadingDiv').modal('show');

    document.getElementById('editor').setAttribute('disabled', '');
}

function hideLoadingDiv()
{
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
    for (var i = 0; i < tabListElements.length; i++) {
        tabListElements[i].actualiseLenght();
        document.getElementById('trackElementId' + tabListElements[i].id).style.width = tabListElements[i].length + 'px';
        document.getElementById('trackElementId' + tabListElements[i].id).style.maxWidth = tabListElements[i].maxLength + 'px';
        document.getElementById('trackElementId' + tabListElements[i].id).style.marginLeft = tabListElements[i].marginXpx + "px"
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
function activeResize() {
    $("#btnResize").button('toggle');
    if (resizing) {
        resizing = false;
        for (i = 0; i < tabListElements.length; i++) {
            document.getElementById('trackElementId' + tabListElements[i].id).style.resize = "none";
        }
    }
    else {
        resizing = true;
        for (i = 0; i < tabListElements.length; i++) {
            document.getElementById('trackElementId' + tabListElements[i].id).style.resize = "horizontal";
        }
    }
}

window.onload = function (e) {
    calculateTimeBar();
}

function makeRender()
{
   renderVar = new Render(tabListElements,tabListFiles,tabListTextElements, tabListTracks);
}

function showError(type, text)
{
    var id = errorId;

    console.log('showError');

    var errors = document.getElementById('errors');

    var error = document.createElement('div');
    error.setAttribute('id', 'error' + errorId);
    error.setAttribute('class', 'alert alert-danger fade in');
    error.innerHTML = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><strong>Error :</strong> ' + text + '';

    errors.appendChild(error);

    var timeOut = setTimeout(function(){hideError(id)}, 10000);

    errorId++;
}

function hideError(id)
{
    console.log('hideError');

    console.log(id);

    $('#error' + id).alert('close');
}