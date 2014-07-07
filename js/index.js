var tabListElements = [];
var tabListFiles = [];
var tabListTracks = [];
var divElementSelectedForMove = {id: null, Object: null, trackId: null, elementListID: null}, canMove = false;
var lastPosition = {x: 0, y: 0};
var actionWorker;
var resizing = false;
var pixelCalculateTime = {g: 0, d: 800};
var renderVar;

var currentUploads = 0;
var tabFilesUpload = [];

var currentProject;
var currentManageTextElement;

var textElementId = 0;

//PROJECT

function newProjectModal(reset)
{
    document.getElementById('nameProject').value = '';
    document.getElementById('buttonNewProject').setAttribute('onclick', 'newProject(' + reset + ');');

    $('#selectProjectModal').modal('hide');
    $('#newProjectModal').modal('show');
}

function newProject(reset)
{
    var nameProject = document.getElementById('nameProject').value;

    if(nameProject != '')
    {
        $('#newProjectModal').modal('hide');

        currentProject.stopAddFileTrack();

        if(reset)
        {
            document.getElementById('tracks').innerHTML = '';
            document.getElementById('VideoView').innerHTML = '';

            tabListElements = [];
            tabListFiles = [];
            tabListTracks = [];
        }

        currentProject.name = document.getElementById('nameProject').value;
        currentProject.dateCreation = getCurrentDate();
        currentProject.lastSave = 'aucune';

        updateTextProject();
        saveProject();
    }
    else
    {
        var n = noty({layout: 'topRight', type: 'error', text: 'Vous devez renseigner le nom du projet.', timeout: '5000'});
    }
}

function openProject()
{
    $('#loadingDiv').modal('show');

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', 'php/getListProjects.php', true);
    OAjax.onreadystatechange = function() {
        if (OAjax.readyState == 4 && OAjax.status == 200) {
            console.log(OAjax.responseText);

            var tabListProjects = JSON.parse(OAjax.responseText);

            console.log(tabListProjects.length);

            if(tabListProjects.length > 0)
            {
                document.getElementById('listProjects').innerHTML = '';

                for(var i = 0; i < tabListProjects.length; i++)
                {
                    document.getElementById('listProjects').innerHTML += '<a onclick="loadProject(\'' + tabListProjects[i] + '\')" class="list-group-item">' + tabListProjects[i] + '</a>';
                }
            }

            $('#loadingDiv').modal('hide');
            $('#selectProjectModal').modal('show');
        }
    };

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send();
}

function loadProject(fileName)
{
    $('#selectProjectModal').modal('hide');
    $('#loadingDiv').modal('show');

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', 'php/readFileProject.php', true);
    OAjax.onreadystatechange = function() {
        if (OAjax.readyState == 4 && OAjax.status == 200) {
            console.log(OAjax.responseText);

            var save =  JSON.parse(OAjax.responseText);
            var loader = new Loader(save);
            loader.load();

            console.log(save);

        }
    };

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send('fileName=' + fileName);
}

function saveProject()
{
    if(currentProject.isCreated)
    {
        currentProject.loadModal('show');

        var fileProject = new GenerateFileProject(currentProject.name, currentProject.dateCreation, currentProject.lastSave, tabListElements, tabListFiles, tabListTextElements, tabListTracks);
        var informations = fileProject.generateMain();

        console.log(informations);

        var OAjax;

        if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
        else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
        OAjax.open('POST', 'php/addFileProject.php', true);
        OAjax.onreadystatechange = function() {
            if(OAjax.readyState == 4 && OAjax.status == 200) {
                console.log('answer : ' + OAjax.responseText);

                if(OAjax.responseText == 'true')
                {
                    currentProject.lastSave = getCurrentDate();

                    uploadAllFiles();
                    updateTextProject();

                    currentProject.loadModal('hide');
                }
                else
                {
                    var n = noty({layout: 'topRight', type: 'error', text: 'Nous n\'arrivons pas à sauvegarder le projet.', timeout: '5000'});

                    currentProject.loadModal('hide');
                }
            }
        };

        OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        OAjax.send('nameProject=' + currentProject.name + '&contentFile=' + JSON.stringify(informations));
    }
    else
    {
        newProjectModal(false);
    }
}

function updateTextProject()
{
    console.log('updateTextProject');

    if(currentProject.isCreated)
    {
        document.getElementById('currentProject').innerHTML = 'Project : ' + currentProject.name + ', last save : ' + currentProject.lastSave;

        document.getElementById('projectDropdown').innerHTML = 'Project : ' + currentProject.name;
        document.getElementById('lastSaveDropdown').innerHTML = 'Last save : ' + currentProject.lastSave;
    }
}

//FILE

function addFile()
{
    currentProject.stopAddFileTrack();

    var currentFile = document.getElementById('fileLoader').files[0];
    console.log(currentFile);

    var typeFile = getTypeFile(currentFile.name);
    console.log(typeFile);

    if(typeFile != 'ERROR')
    {
        var fileId = tabListFiles.length;

        if(typeFile == TYPE.IMAGE)
        {
            var currentItem = new FileList(fileId, typeFile, currentFile.size, currentFile.name, compressName(currentFile.name), currentFile.name.split('.').pop());
            currentItem.setDuration('00:00:20');

            tabListFiles.push(currentItem);
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

                var currentItem = new FileList(fileId, typeFile, currentFile.size, currentFile.name, compressName(currentFile.name), currentFile.name.split('.').pop());
                console.log('currentItem ' + currentItem);
                tabListFiles.push(currentItem);
            };

            reader.readAsArrayBuffer(currentFile);

            currentProject.loadModal('show');
        }

        console.log('next');

        if(tabListFiles.length <= 1)
        {
            document.getElementById('listFiles').innerHTML = '';
        }

        var iconName = '';

        switch(typeFile)
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
        fileE.id = 'file' + fileId;
        fileE.href = '#';
        fileE.setAttribute('fileId', fileId);
        fileE.setAttribute('onclick', 'fileProperties(' + fileId + ');');
        fileE.classList.add('list-group-item');
        fileE.innerHTML = '<h4 id="nameFile' + fileId + '" class="list-group-item-heading"><span class="glyphicon ' + iconName + '"></span> ' + compressName(currentFile.name) + '</h4><div id="toolsFile' + fileId + '"></div>';

        document.getElementById('listFiles').appendChild(fileE);

        uploadFile(fileId, currentFile);
    }
    else
    {
        var n = noty({layout: 'topRight', type: 'error', text: 'Erreur, ce fichier n\'est pas compatible avec le système.', timeout: '5000'});
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
        return TYPE.AUDIO;
    }
    else if(tabExtensionVideo.lastIndexOf(extension.toLowerCase()) != -1)
    {
        return TYPE.VIDEO;
    }
    else if(tabExtensionImage.lastIndexOf(extension.toLowerCase()) != -1)
    {
        return TYPE.IMAGE;
    }
    else
    {
        return 'ERROR';
    }
}

function compressName(name)
{
    return ((name.length > 12) ? name.substring(0, 4) + '...' + name.substring(name.length - 5, name.length) : name);
}

function uploadFile(id, file)
{
    if(currentProject.isCreated)
    {
        currentUploads++;

        document.getElementById('toolsFile' + id).innerHTML = '<div id="divProgressFile' + id + '" class="progress"><div id="progressFile' + id + '" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"><span class="sr-only">0% Complete</span></div></div>';

        var fd = new FormData();
        fd.append('multimediaFile', file);
        var xhr = new XMLHttpRequest();
        xhr.file = file; // not necessary if you create scopes like this
        xhr.addEventListener('progress', function(e) {

            var done = e.position || e.loaded,
                total = e.totalSize || e.total;

            console.log('xhr progress: ' + (Math.floor(done / total * 1000) / 10) + '%');

            document.getElementById('progressFile' + id).style.width = (Math.floor(done / total * 1000) / 10) + '%';

        }, false);
        if (xhr.upload) {
            xhr.upload.onprogress = function(e) {
                var done = e.position || e.loaded,
                    total = e.totalSize || e.total;

                console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');

                document.getElementById('progressFile' + id).style.width = (Math.floor(done / total * 1000) / 10) + '%';
            };
        }
        xhr.onreadystatechange = function(e) {
            if (4 == this.readyState) {
                console.log('xhr upload complete ' + this.responseText);

                currentUploads--;

                if (this.responseText != "success")
                {
                    tabFilesUpload[tabFilesUpload.length] = [id, file];

                    var n = noty({layout: 'top', type: 'error', text: 'Nous n\'avons pas réussi à envoyer ce fichier', timeout: '5000'});

                    var buttonRetryUpload = document.createElement('button');
                    buttonRetryUpload.setAttribute('type', 'button');
                    buttonRetryUpload.setAttribute('onclick', 'uploadMultimediaFile(\'' + id + '\', \'' + file + '\');');
                    buttonRetryUpload.setAttribute('class', 'btn btn-danger btn-block');
                    buttonRetryUpload.innerHTML = 'Réessayer';

                    document.getElementById('toolsFile' + id).innerHTML = '';
                    document.getElementById('toolsFile' + id).appendChild(buttonRetryUpload);
                }
                else
                {
                    var n = noty({layout: 'top', type: 'success', text: 'Le fichier ' + file.name + ' a bien été envoyé.', timeout: '5000'});

                    document.getElementById('toolsFile' + id).innerHTML = '';
                }
            }
        };

        xhr.open('POST', 'php/uploadFile.php?u=User1&p=' + currentProject.name + '&fileId=' + id, true);
        xhr.send(fd);
    }
    else
    {
        tabFilesUpload[tabFilesUpload.length] = [id, file];

        document.getElementById('toolsFile' + id).innerHTML = 'Pas encore envoyé.';
    }
}

function uploadAllFiles()
{
    if(tabFilesUpload.length > 0)
    {
        console.log('filesToUpload');

        for(var i = 0; i < tabFilesUpload.length; i++)
        {
            uploadFile(tabFilesUpload[i][0], tabFilesUpload[i][1]);
        }

        tabFilesUpload = [];
    }
    else
    {
        console.log('notFilesToUpload');
    }
}

function newTextElement()
{
    console.log('newTextElement');

    currentProject.stopAddFileTrack();
    currentManageTextElement.newTextElement(textElementId);

    textElementId++;

    $('#textElementModal').modal('show');
}

function editFileText(id)
{
    var textElement = tabListFiles[id].properties;

    currentManageTextElement.editTextElement(textElement.id, id, textElement.nameText, textElement.contentText, textElement.fontText, textElement.sizeText, textElement.colorText, textElement.alignText, textElement.posText);

    $('#textElementModal').modal('show');
}

function saveTextElement()
{
    var textElement = currentManageTextElement.getInformationsTextElement();

    var fileId;

    if(currentManageTextElement.isEditing)
    {
        fileId = currentManageTextElement.fileId;

        tabListFiles[fileId].properties.updateValuesElement(textElement.nameText, textElement.text, textElement.font, textElement.sizeText, textElement.color, textElement.textAlign, textElement.posElement);
    }
    else
    {
        fileId = tabListFiles.length;

        var currentItem = new FileList(fileId, TYPE.TEXT, 0, textElement.nameText, compressName(textElement.nameText), 'png');
        currentItem.setDuration('00:00:20');
        currentItem.setProperties(new TextElement(textElement.id, textElement.nameText, textElement.text, textElement.font, textElement.sizeText, textElement.color, textElement.textAlign, textElement.posElement));

        console.log('currentItem ' + currentItem);
        tabListFiles.push(currentItem);

        if(tabListFiles.length <= 1)
        {
            document.getElementById('listFiles').innerHTML = '';
        }

        var fileE = document.createElement('a');
        fileE.id = 'file' + fileId;
        fileE.href = '#';
        fileE.setAttribute('fileId', fileId);
        fileE.setAttribute('onclick', 'fileProperties(' + fileId + ');');
        fileE.classList.add('list-group-item');
        fileE.innerHTML = '<h4 id="nameFile' + fileId + '" class="list-group-item-heading"><span class="glyphicon glyphicon-text-width"></span> ' + compressName(textElement.nameText) + '</h4><div id="toolsFile' + fileId + '"></div>';

        document.getElementById('listFiles').appendChild(fileE);
    }

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', 'php/uploadPngTitle.php?u=User1&p=' + currentProject.name, true);
    OAjax.onreadystatechange = function() {
        if(OAjax.readyState == 4 && OAjax.status == 200) {
            console.log(OAjax.responseText);

            if (OAjax.responseText == 'true')
            {
                console.log('upload');
            }
        }
    };

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send('&nameId=' + fileId + '&imageDataURL=' + document.getElementById('textElement').toDataURL('image/png'));

    var n = noty({layout: 'topRight', type: 'success', text: 'Le texte a bien été sauvegardé.', timeout: '5000'});

    $('#textElementModal').modal('hide');
}

function fileProperties(id)
{
    console.log('fileProperties');

    var fileInfo = tabListFiles[id];
    var type = tabListFiles[id].type;

    document.getElementById('FileListName').innerHTML = fileInfo.fileName;
    document.getElementById('FileListSize').innerHTML = fileInfo.size + ' Octets';
    document.getElementById('FileListFormat').innerHTML = fileInfo.format;
    document.getElementById('FileListDuration').innerHTML = fileInfo.duration;

    var preview;

    if(type == TYPE.TEXT || type == TYPE.IMAGE)
    {
        preview = '<img class="previewFileContent" src="http://clangue.net/testVideo/php/getFile.php?p=' + currentProject.name + '&fileId=' + fileInfo.id + '">';
    }
    else
    {
        preview = 'Non disponible';
    }

    document.getElementById('FileListPreview').innerHTML = preview;

    if(type == TYPE.TEXT)
    {
        document.getElementById('fileEditButton').setAttribute('onclick', 'editFileText(' + id + ');');
        document.getElementById('fileEditButton').style.display = '';
    }
    else if(type == TYPE.IMAGE)
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

    $('#filePropertiesModal').modal('show');
}

function editFileImage(id)
{
    console.log('editFileImage');
}

function removeFile(id)
{
    $('#filesPropertiesModal').modal('hide');

    tabListFiles[id] = null;

    document.getElementById('listFiles').removeChild(document.getElementById('file' + id));
}

//TRACK

function addTrack()
{
    var nextId = (tabListTracks.length != 0) ? (tabListTracks[tabListTracks.length - 1].id + 1) : 0;

    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById('VideoView');
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('div');
    newTrack.setAttribute('class', 'singleTrack');
    newTrack.setAttribute('id', 'track' + nextId);
    newTrack.innerHTML = '<div class="valuesTrack"><input type="text" onkeyup="updateNameTrack(' + nextId + ', this.value);" class="form-control"  placeholder="Name" value="Undefined"></br><input type="range" step="1" onchange="updateVolumeTrack(' + nextId + ', this.value);" min="1" max="100" class="form-control"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="currentProject.startAddFileTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
    tracks.appendChild(newTrack);

    newViewTrack.setAttribute('class', 'singleTrack');
    newViewTrack.setAttribute('style','width: 1000px;');
    newViewTrack.setAttribute('id', 'ViewTrack' + nextId);
    newViewTrack.innerHTML = '<p id="textViewEditor' + nextId + '" class="textViewEditor">Aucune vidéo n\'est présente dans cette piste.</p>';
    videoView.appendChild(newViewTrack);

    var track = new Track(tabListTracks.length, 'Undefined');

    tabListTracks.push(track);
}
function deleteTrack(id){
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById('VideoView');
    var trackToDelete = document.getElementById('track' + id);
    var ViewTrackToDelete = document.getElementById('ViewTrack' + id);
    videoView.removeChild(ViewTrackToDelete);
    tracks.removeChild(trackToDelete);

    var tabTrackId;

    for (i=0;i< tabListTracks.length;i++)
    {
        if (tabListTracks[i].id == id)
        {
           tabTrackId = i;
        }
    }

    elementsInTrack = tabListTracks[tabTrackId].elementsId;
    for (i=0;i<elementsInTrack.length;i++)
    {

    }

    tabListTracks.remove(tabTrackId);

    currentProject.stopAddFileTrack();
}
function updateNameTrack(id, nameTrack){
    console.log(nameTrack);

    tabListTracks[id].changeName(nameTrack);
}
function updateVolumeTrack(id, valueVolume){
    console.log('updateVolumeTrack');

    tabListTracks[id].changeVolume(valueVolume);
}

function settingsTrack(id){
    console.log('settingsTrack');
}
function removeElementFromTrack(trackId, ElementId){
    var iterationForElementId, trackItId;
    for (i=0; i< tabListElements.length;i++)
    {
        if (tabListElements[i].id == ElementId)
        {
            iterationForElementId = i;
        }
    }

    for (i=0; i< tabListTracks.length;i++)
    {
        if (tabListTracks[i].id == trackId)
        {
            trackItId = i;
        }
    }

    var track = document.getElementById('ViewTrack' + trackItId);
    var elementToDelete = document.getElementById("trackElementId" + tabListElements[iterationForElementId].id);
    track.removeChild(elementToDelete);
    tabListElements.remove(iterationForElementId);

    canMove = false;

    tabListTracks[trackId].elementsId.remove(tabListTracks[trackId].elementsId.lastIndexOf(ElementId));

}
Array.prototype.remove = function(from, to) { var rest = this.slice((to || from) + 1 || this.length); this.length = from < 0 ? this.length + from : from; return this.push.apply(this, rest); };
//SCROLL
function scroolAllTracks(){
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
function prepareMoveElement(elementListID){
    divElementSelectedForMove.elementListID = elementListID;
    divElementSelectedForMove.id = tabListElements[elementListID].id;
    divElementSelectedForMove.trackId = tabListElements[elementListID].trackId;
    divElementSelectedForMove.Object = document.getElementById("trackElementId" + tabListElements[elementListID].id);
    canMove = true;
    console.log('true!')
}
function stopMoveElement(){
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
    var info = tabListFiles[id];

    console.log(info);

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
    element.innerHTML = info.fileName + " <button class='btn btn-xs removeElement' onclick='removeElementFromTrack(" + idTrack + "," + idElement + ")'><span class='glyphicon glyphicon-remove'></span></button>";
    element.setAttribute('id', 'trackElementId' + idElement);
    element.setAttribute('onmousedown', 'prepareMoveElement(' + idElement + ')');
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
function newRecord(){
    currentProject.stopAddFileTrack();

    document.getElementById('chooseRecordButtons').style.display = '';
    document.getElementById('videoRecord').style.display = 'none';
    document.getElementById('audioRecord').style.display = 'none';
    document.getElementById('saveRecordButton').style.display = 'none';

    document.getElementById('saveRecordButton').setAttribute('disabled', '');

    $('#recordAudioOrVideoElement').modal('show');
}
function chooseVideoRecord(){
    document.getElementById('videoRecord').style.display = '';
    document.getElementById('saveRecordButton').style.display = '';
    document.getElementById('audioRecord').style.display = 'none';
    document.getElementById('chooseRecordButtons').style.display = 'none';
}
function chooseAudioRecord(){
    document.getElementById('audioRecord').style.display = '';
    document.getElementById('saveRecordButton').style.display = '';
    document.getElementById('videoRecord').style.display = 'none';
    document.getElementById('chooseRecordButtons').style.display = 'none';
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
    updateTextProject();
}
function makeRender(){
   renderVar = new Render(tabListElements,tabListFiles,tabListTextElements, tabListTracks);
}
function getCurrentDate(){
    var date = new Date();

    var dayOfMonth = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    var month = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);

    var hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    var minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    var second = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();

    var currentDate = dayOfMonth + '/' + month + '/' + date.getFullYear() + ' ' + hour + ':' + minute + ':' + second;

    console.log('currentDate : ' + currentDate);

    return currentDate;
}
window.onbeforeunload = function (e) {
    e = e || window.event;

    saveProject();

    if(currentUploads > 0)
    {
        var msg = 'Envoi en cours des fichier, ne fermez pas encore la fenêtre ou tout sera perdu.';

        // For IE and Firefox
        if (e) {e.returnValue = msg;}

        // For Chrome and Safari
        return msg;
    }
};