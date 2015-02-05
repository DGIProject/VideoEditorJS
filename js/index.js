var divElementSelectedForMove = {id: null, Object: null, trackId: null, elementListID: null}, canMove = false;
var lastPosition = {x: 0, y: 0};
var actionWorker;
var resizing = false;
var pixelCalculateTime = {g: 0, d: 800};
var renderVar;

var textElementId = 0;

//PROJECT

function setValues(username){
    currentProject.username = username;
}

function getListProjects(id){
    var xmlhttp = xmlHTTP();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(xmlhttp.responseText);

            var tabListProjects = JSON.parse(xmlhttp.responseText);

            console.log(tabListProjects.length);

            if(tabListProjects.length > 0)
            {
                document.getElementById(id).innerHTML = '';

                for(var i = 0; i < tabListProjects.length; i++)
                {
                    document.getElementById(id).innerHTML += '<a href="#" onclick="loadProject(\'' + tabListProjects[i] + '\')" class="list-group-item" data-dismiss="modal">' + tabListProjects[i] + '</a>';
                }
            }
            else
            {
                document.getElementById(id).innerHTML = 'There is not projects.';
            }
        }
    };

    xmlhttp.open("POST", "php/getListProjects.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send();
}

function newProject(reset) {
    document.getElementById('nameProject').value = '';
    document.getElementById('buttonNewProject').setAttribute('onclick', 'saveNewProject(' + reset + ');');

    $('#selectProjectModal').modal('hide');
    $('#newProjectModal').modal('show');
}

function saveNewProject(reset) {
    var nameProject = document.getElementById('nameProject').value;

    if(nameProject != '')
    {
        $('#newProjectModal').modal('hide');

        currentProject.stopAddFileTrack();

        if(reset)
        {
            currentProject.resetProject();
        }

        currentProject.isCreated = true;
        currentProject.name = nameProject;
        currentProject.dateCreation = getCurrentDate();
        currentProject.lastSave = 'none';

        updateTextProject();
        startAutoSave();
    }
    else
    {
        var n = noty({layout: 'topRight', type: 'error', text: 'Vous devez renseigner le nom du projet.', timeout: '5000'});
    }
}

function openProject() {
    getListProjects('listProjects');

    $('#selectProjectModal').modal('show');
}

function loadProject(fileName) {
    loadM();

    var xmlhttp = xmlHTTP();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(xmlhttp.responseText);

            var loader = new Loader(JSON.parse(xmlhttp.responseText));
            loader.load();
        }
    };

    xmlhttp.open("POST", "php/readFileProject.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('fileName=' + fileName);
}

function saveProject() {
    if(currentProject.isCreated)
    {
        loadM();

        var fileProject = new GenerateFileProject(currentProject.name, currentProject.dateCreation, currentProject.lastSave, currentProject.tabListElements, currentProject.tabListFiles, currentProject.tabListTracks);
        var contentFile = fileProject.generateMain();

        var xmlhttp = xmlHTTP();

        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                console.log('answer : ' + xmlhttp.responseText);

                if(xmlhttp.responseText == 'true')
                {
                    currentProject.lastSave = getCurrentDate();
                    currentProject.updateText();

                    uploadAllFiles();
                    loadM();
                }
                else
                {
                    var n = noty({layout: 'topRight', type: 'error', text: 'Nous n\'arrivons pas à sauvegarder le projet.', timeout: '5000'});

                    loadM();
                }
            }
        };

        xmlhttp.open("POST", "php/addFileProject.php", true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send('nameProject=' + this.name + '&contentFile=' + JSON.stringify(contentFile));
    }
    else
    {
        newProject(false);
    }
}

function resetProject() {
    document.getElementById('tracks').innerHTML = '';
    document.getElementById('VideoView').innerHTML = '';
    document.getElementById('listFiles').innerHTML = '';

    oneSecond = 5;
    document.getElementById('zoomRange').value = 5;
    calculateTimeBar();

    currentProject.tabListElements = [];
    currentProject.tabListFiles = [];
    currentProject.tabListTracks = [];
}

function autoSaveInterval() {
    saveProject();
}

//MODAL

function loadM() {
    $('#loadModal').modal('toggle');
}

//FILE

function addFile(){
    currentProject.stopAddFileTrack();

    var currentFile = document.getElementById('fileLoader').files[0];
    console.log(currentFile);

    var typeFile = getTypeFile(currentFile.name);
    console.log(typeFile);

    if(typeFile != 'ERROR')
    {
        var fileId = currentProject.tabListFiles.length;

        if(typeFile == TYPE.IMAGE)
        {
            var currentItem = new FileList(fileId, typeFile, currentFile.size, currentFile.name, compressName(currentFile.name), currentFile.name.split('.').pop());
            currentItem.setDuration('00:00:20');

            currentProject.tabListFiles.push(currentItem);
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
                    ],
                    fileType : typeFile,
                    action : actionWorker
                });

                var currentItem = new FileList(fileId, typeFile, currentFile.size, currentFile.name, compressName(currentFile.name), currentFile.name.split('.').pop());
                console.log('currentItem ' + currentItem);

                currentProject.tabListFiles.push(currentItem);
            };

            reader.readAsArrayBuffer(currentFile);

            loadM();
        }

        console.log('next');

        addFileList(fileId, currentFile, typeFile);
        uploadFile(fileId, currentFile);
    }
    else
    {
        var n = noty({layout: 'topRight', type: 'error', text: 'Erreur, ce fichier n\'est pas compatible avec le système.', timeout: '5000'});
    }
}

function getTypeFile(fileName) {
    console.log(fileName);

    var extension = fileName.split('.').reverse()[0];
    console.log(extension);

    var tabExtensionAudio = ['mp3', 'wav','wmv'];
    var tabExtensionVideo = ['avi', 'mp4','wma','flv', 'webm'];
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

function compressName(name) {
    return ((name.length > 12) ? name.substring(0, 4) + '...' + name.substring(name.length - 5, name.length) : name);
}

function uploadFile(id, file){
    if(currentProject.isCreated)
    {
        currentProject.currentUploads++;

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

                currentProject.currentUploads--;

                if (this.responseText != "success")
                {
                    currentProject.tabFilesUpload[currentProject.tabFilesUpload.length] = [id, file];

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

        xhr.open('POST', 'php/uploadFile.php?p=' + currentProject.name + '&fileId=' + id, true);
        xhr.send(fd);
    }
    else
    {
        currentProject.tabFilesUpload[currentProject.tabFilesUpload.length] = [id, file];

        document.getElementById('toolsFile' + id).innerHTML = 'Pas encore envoyé.';
    }
}

function uploadAllFiles() {
    if(currentProject.tabFilesUpload.length > 0)
    {
        console.log('filesToUpload');

        for(var i = 0; i < currentProject.tabFilesUpload.length; i++)
        {
            uploadFile(currentProject.tabFilesUpload[i][0], currentProject.tabFilesUpload[i][1]);
        }

        currentProject.tabFilesUpload = [];
    }
    else
    {
        console.log('notFilesToUpload');
    }
}

function addFileList(fileId, currentFile, typeFile) {
    if(currentProject.tabListFiles.length < 1)
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
}

function newTextElement(){
    console.log('newTextElement');

    currentProject.stopAddFileTrack();
    currentManageTextElement.newTextElement(textElementId);

    textElementId++;

    $('#textElementModal').modal('show');
}
function editFileText(id){
    var textElement = currentProject.tabListFiles[id].properties;

    currentManageTextElement.editTextElement(textElement.id, id, textElement.nameText, textElement.contentText, textElement.fontText, textElement.sizeText, textElement.colorText, textElement.alignText, textElement.posText);

    $('#textElementModal').modal('show');
}
function saveTextElement(){
    var textElement = currentManageTextElement.getInformationsTextElement();

    var fileId;

    if(currentManageTextElement.isEditing)
    {
        fileId = currentManageTextElement.fileId;

        currentProject.tabListFiles[fileId].properties.updateValuesElement(textElement.nameText, textElement.text, textElement.font, textElement.sizeText, textElement.color, textElement.textAlign, textElement.posElement);
    }
    else
    {
        fileId = currentProject.tabListFiles.length;

        var currentItem = new FileList(fileId, TYPE.TEXT, 0, textElement.nameText, compressName(textElement.nameText), 'png');
        currentItem.setDuration('00:00:20');
        currentItem.setProperties(new TextElement(textElement.id, textElement.nameText, textElement.text, textElement.font, textElement.sizeText, textElement.color, textElement.textAlign, textElement.posElement));

        console.log('currentItem ' + currentItem);
        currentProject.tabListFiles.push(currentItem);

        if(currentProject.tabListFiles.length <= 1)
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
function fileProperties(id){
    console.log('fileProperties');

    var fileInfo = currentProject.tabListFiles[id];
    var type = currentProject.tabListFiles[id].type;

    document.getElementById('FileListName').innerHTML = fileInfo.fileName;
    document.getElementById('FileListSize').innerHTML = fileInfo.size + ' Octets';
    document.getElementById('FileListFormat').innerHTML = fileInfo.format;
    document.getElementById('FileListDuration').innerHTML = fileInfo.duration;

    var preview;

    if(type == TYPE.TEXT || type == TYPE.IMAGE)
    {
        preview = '<img class="previewFileContent" src="php/getFile.php?p=' + currentProject.name + '&fileId=' + fileInfo.id + '">';
    }
    else if (type == TYPE.VIDEO)
    {
        preview = '<img class="previewFileContent" src="php/getFile.php?p=' + currentProject.name + '&thum=1&fileId=' + fileInfo.id + '">';
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
function editFileImage(id){
    console.log('editFileImage');
}
function removeFile(id){
    $('#filesPropertiesModal').modal('hide');

    currentProject.tabListFiles[id] = null;
    currentProject.tabListFiles.remove(id);

    document.getElementById('listFiles').removeChild(document.getElementById('file' + id));
}
function uploadThumbnail(id, data) {
    var fd = new FormData();
    fd.append('multimediaFile', data);
    var xhr = new XMLHttpRequest();
    xhr.file = data; // not necessary if you create scopes like this
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

            if (this.responseText != "success")
            {
                console.log("erreur Upload", this.responseText)
            }
            else
            {
                var n = noty({layout: 'top', type: 'success', text: 'La vignette a bien été envoyé.', timeout: '5000'});
            }
        }
    };

    xhr.open('POST', 'php/uploadFile.php?p=' + currentProject.name + '&thum=1&fileId=' + id, true);
    xhr.send(fd);
}
//TRACK
function addTrack(){
    var nextId = (currentProject.tabListTracks.length != 0) ? (currentProject.tabListTracks[currentProject.tabListTracks.length - 1].id + 1) : 0;

    var videoInfo = document.createElement('div');
    videoInfo.classList.add('singleTrack');
    videoInfo.innerHTML = '<div class="valuesTrack"><span>VIDEO ' + nextId + '</span></div><div class="optionsTrack"><button type="button" onclick="currentProject.startAddFileTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';

    var videoView = document.createElement('canvas');
    videoView.id = 'videoView' + nextId;
    videoView.classList.add('singleTrack');
    videoView.style.width = '100%';

    videoView.onmousedown = mouseDown;
    videoView.onmouseup = mouseUp;
    videoView.onmousemove = mouseMove;

    document.getElementById('videoInfo').appendChild(videoInfo);
    document.getElementById('videoView').appendChild(videoView);

    currentProject.tabListTracks.push(new Track(nextId, 'VIDEO', {element: videoView, context: videoView.getContext('2d')}));

    drawElements(currentProject.tabListTracks.length - 1);

    nextId = (currentProject.tabListTracks.length != 0) ? (currentProject.tabListTracks[currentProject.tabListTracks.length - 1].id + 1) : 0;

    var audioInfo = document.createElement('div');
    audioInfo.classList.add('singleTrack');
    audioInfo.innerHTML = '<div class="valuesTrack"><span>AUDIO ' + nextId + '</span></br><input type="range" step="1" onchange="updateVolumeTrack(' + nextId + ', this.value);" min="1" max="100" class="form-control"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="currentProject.startAddFileTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';

    var audioView = document.createElement('canvas');
    audioView.id = 'audioView' + nextId;
    audioView.classList.add('singleTrack');
    audioView.style.width = '100%';

    audioView.onmousedown = mouseDown;
    audioView.onmouseup = mouseUp;
    audioView.onmousemove = mouseMove;

    document.getElementById('audioInfo').appendChild(audioInfo);
    document.getElementById('audioView').appendChild(audioView);

    currentProject.tabListTracks.push(new Track(nextId, 'AUDIO', {element: audioView, context: audioView.getContext('2d')}));

    drawElements(currentProject.tabListTracks.length - 1);

    /*
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById('VideoView');
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('canvas');
    newTrack.setAttribute('class', 'singleTrack');
    newTrack.setAttribute('id', 'track' + nextId);
    //newTrack.setAttribute('onmouseover', 'hoverTrack(' + nextId + ');');
    //newTrack.setAttribute('onmouseout', 'outHoverTrack(' + nextId + ');');
    newTrack.innerHTML = '<div class="valuesTrack"><span>Track ' + nextId + '</span></br><input type="range" step="1" onchange="updateVolumeTrack(' + nextId + ', this.value);" min="1" max="100" class="form-control"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="currentProject.startAddFileTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-plus"></span></button><button type="button" onclick="settingsTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrack(' + nextId + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';
    tracks.appendChild(newTrack);

    newViewTrack.setAttribute('class', 'singleTrack');
    newViewTrack.setAttribute('style','width: 1000px;');
    newViewTrack.setAttribute('id', 'ViewTrack' + nextId);
    //newViewTrack.setAttribute('onmouseover', 'hoverTrack(' + nextId + ');');
    //newViewTrack.setAttribute('onmouseout', 'outHoverTrack(' + nextId + ');');
    //newViewTrack.innerHTML = '<p id="textViewEditor' + nextId + '" class="textViewEditor">Aucun élément n\'est présent dans cette piste.</p>';
    videoView.appendChild(newViewTrack);
    */
}

function deleteTrack(id){
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById('VideoView');
    var trackToDelete = document.getElementById('track' + id);
    var ViewTrackToDelete = document.getElementById('ViewTrack' + id);
    videoView.removeChild(ViewTrackToDelete);
    tracks.removeChild(trackToDelete);

    var tabTrackId;

    for (i=0;i< currentProject.tabListTracks.length;i++)
    {
        if (currentProject.tabListTracks[i].id == id)
        {
           tabTrackId = i;
        }
    }

    elementsInTrack = currentProject.tabListTracks[tabTrackId].elementsId;
    for (i=0;i<elementsInTrack.length;i++)
    {

    }

    currentProject.tabListTracks.remove(tabTrackId);

    currentProject.stopAddFileTrack();
}
function updateVolumeTrack(id, valueVolume){
    console.log('updateVolumeTrack');

    currentProject.tabListTracks[id].upVolume(valueVolume);
}
function settingsTrack(id){
    console.log('settingsTrack');
}
function removeElementFromTrack(trackId, ElementId){
    var iterationForElementId, trackItId;
    for (i=0; i< currentProject.tabListElements.length;i++)
    {
        if (currentProject.tabListElements[i].id == ElementId)
        {
            iterationForElementId = i;
        }
    }

    for (i=0; i< currentProject.tabListTracks.length;i++)
    {
        if (currentProject.tabListTracks[i].id == trackId)
        {
            trackItId = i;
        }
    }

    var track = document.getElementById('ViewTrack' + trackItId);
    var elementToDelete = document.getElementById("trackElementId" + currentProject.tabListElements[iterationForElementId].id);
    track.removeChild(elementToDelete);
    currentProject.tabListElements.remove(iterationForElementId);

    canMove = false;

    currentProject.tabListTracks[trackId].elementsId.remove(currentProject.tabListTracks[trackId].elementsId.lastIndexOf(ElementId));

}

Array.prototype.remove = function(from, to) { var rest = this.slice((to || from) + 1 || this.length); this.length = from < 0 ? this.length + from : from; return this.push.apply(this, rest); };

function hoverTrack(id){
    document.getElementById('track' + id).style.backgroundColor = '#F4F4F4';
    document.getElementById('ViewTrack' + id).style.backgroundColor = '#F4F4F4';
}
function outHoverTrack(id){
    document.getElementById('track' + id).style.backgroundColor = '#FFFFFF';
    document.getElementById('ViewTrack' + id).style.backgroundColor = '#FFFFFF';
}
//SCROLL
function scroolAllTracks(){
    var tracks = document.getElementById("tracks"), videoTrackView = document.getElementById("VideoView");
    var positionActuelle = videoTrackView.scrollTop;
    //  console.log(positionActuelle);
    tracks.scrollTop = positionActuelle;
    videoTrackView.scrollTop = positionActuelle;
    pixelCalculateTime.g = 0 + videoTrackView.scrollLeft;
    pixelCalculateTime.d = 800 + videoTrackView.scrollLeft;

    for(var i = 0; i < currentProject.tabListTracks.length; i++)
    {
        if(currentProject.tabListTracks[i] != 0)
        {
            document.getElementById('ViewTrack' + i).style.width = pixelCalculateTime.d + 'px';
        }
    }

    calculateTimeBar();
}
function prepareMoveElement(elementListID){
    divElementSelectedForMove.elementListID = elementListID;
    divElementSelectedForMove.id = currentProject.tabListElements[elementListID].id;
    divElementSelectedForMove.trackId = currentProject.tabListElements[elementListID].trackId;
    divElementSelectedForMove.Object = document.getElementById("trackElementId" + currentProject.tabListElements[elementListID].id);
    canMove = true;
    console.log('Can move')
}
function stopMoveElement(){
    canMove = false;
    console.log('can \'t move');
    if (parseInt(divElementSelectedForMove.Object.style.width.replace('px', '')) <= parseInt(divElementSelectedForMove.Object.style.maxWidth.replace('px', ''))) {
        currentProject.tabListElements[parseInt(divElementSelectedForMove.Object.id.replace('trackElementId', ''))].resize(parseInt(divElementSelectedForMove.Object.style.width.replace('px', '')),parseInt(divElementSelectedForMove.Object.offsetLeft));
    }
    else {
        divElementSelectedForMove.Object.style.width = divElementSelectedForMove.Object.style.maxWidth;

    }
    currentProject.tabListElements[parseInt(divElementSelectedForMove.Object.id.replace('trackElementId', ''))].setMarginX(divElementSelectedForMove.Object.style.marginLeft.replace('px', ''))
}

function addElement(id, idTrack) {
    var info = currentProject.tabListFiles[id];

    console.log(info);

    var idElement = (currentProject.tabListElements.length > 0) ? currentProject.tabListElements[currentProject.tabListElements.length-1].id + 1 : 0;

    var marginLeft = 0;

    for(var i = 0; i < currentProject.tabListTracks.length; i++)
    {
        for(var x = 0; x < currentProject.tabListTracks[i].tabElements.length; x++)
        {
            marginLeft = (currentProject.tabListTracks[i].tabElements[x].marginLeft > marginLeft) ? currentProject.tabListTracks[i].tabElements[x].marginLeft : marginLeft;
        }
    }

    currentProject.tabListTracks[idTrack].tabElements.push(new Element(idElement, info.fileName, info.duration, id, idTrack, marginLeft, false));

    drawElements(idTrack);

    /*
    var actualTrack = document.getElementById("ViewTrack" + idTrack);
    currentProject.tabListTracks[idTrack].elementsId.push(idElement);

    var element = document.createElement("div");
    element.setAttribute('class', "trackElement");
    element.style.backgroundColor = currentProject.tabListTracks[idTrack].color;
    element.innerHTML = info.fileName + " <button class='btn btn-xs removeElement' onclick='removeElementFromTrack(" + idTrack + "," + idElement + ")'><span class='glyphicon glyphicon-remove'></span></button>"+ ((info.type == TYPE.VIDEO)? "<img height='50px' width='auto' src='php/getFile.php?p=" + currentProject.name + "&thum=1&fileId=" + info.id + "' onmousedown='return false' onmousemove='return false'>" : ((info.type != TYPE.AUDIO)? "<img class='thumbnailImage' src='php/getFile.php?p=" + currentProject.name + "&fileId=" + info.id + "' onmousedown='return false' onmousemove='return false'>" : "")) ;
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
    currentProject.tabListElements.push(ElementToAdd);
    */
}
function newRecord(){
    currentProject.stopAddFileTrack();

    document.getElementById('chooseRecordButtons').style.display = '';
    document.getElementById('videoRecord').style.display = 'none';
    document.getElementById('saveRecordButton').style.display = 'none';
    document.getElementById('saveRecordButton').setAttribute('disabled', '');

    $('#recordAudioOrVideoElement').modal('show');
}
function chooseAudioVideoRecord(audioa){

    audio.style.display = "none";
    para = {video:true, audio:true};
    if (audioa)
    {
        para = {video:false,audio:true};
        video = document.getElementById('audio');
        audio.style.display = '';
    }
    document.getElementById('video').style.display = '';
    document.getElementById('chooseRecordButtons').style.display = 'none';
    document.getElementById('videoRecord').style.display = '';

    startRecordingbtn.disabled = false;
    stopRecordingbtn.disabled = true;
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
    calculateTimeBar();
    for (var i = 0; i < currentProject.tabListElements.length; i++) {
        currentProject.tabListElements[i].actualiseLenght();
        document.getElementById('trackElementId' + currentProject.tabListElements[i].id).style.width = currentProject.tabListElements[i].length + 'px';
        document.getElementById('trackElementId' + currentProject.tabListElements[i].id).style.maxWidth = currentProject.tabListElements[i].maxLength + 'px';
        document.getElementById('trackElementId' + currentProject.tabListElements[i].id).style.marginLeft = currentProject.tabListElements[i].marginXpx + "px"
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
        for (i = 0; i < currentProject.tabListElements.length; i++) {
            document.getElementById('trackElementId' + currentProject.tabListElements[i].id).style.resize = "none";
        }
    }
    else {
        resizing = true;
        for (i = 0; i < currentProject.tabListElements.length; i++) {
            document.getElementById('trackElementId' + currentProject.tabListElements[i].id).style.resize = "horizontal";
        }
    }
}
window.onload = function (e) {
    calculateTimeBar();
}
function makeRender(state){
   renderVar = new Render(currentProject.tabListElements, currentProject.tabListFiles, currentProject.tabListTracks, state);
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

    if(currentProject.currentUploads > 0)
    {
        var msg = 'Envoi en cours des fichier, ne fermez pas encore la fenêtre ou tout sera perdu.';

        // For IE and Firefox
        if (e) {e.returnValue = msg;}

        // For Chrome and Safari
        return msg;
    }
};

function xmlHTTP() {
    return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
}