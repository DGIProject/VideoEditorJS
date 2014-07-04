var tabListElements = [];
var tabListFiles = [];
var tabListTextElements = [];
var tabListTracks = [];
var divElementSelectedForMove = {id: null, Object: null, trackId: null, elementListID: null}, canMove = false;
var lastPosition = {x: 0, y: 0};
var actionWorker;
var resizing = false;
var pixelCalculateTime = {g: 0, d: 800};
var context = document.getElementById('textRender').getContext('2d');
var posX, posY;
var renderVar;

var currentUploads = 0;
var tabFilesUpload = [];

var currentProject;

window.onmousemove = handleMouseMove;

//PROJECT

function newProjectModal(reset)
{
    document.getElementById('nameProject').value = '';
    document.getElementById('buttonNewProject').setAttribute('onclick', 'newProject(' + reset + ');');

    $('#selectProjectModal').modal('hide');
    $('#newProjectModal').modal('show');
}
function newProject(reset){
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
            tabListTextElements = [];
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
        var n = noty({layout: 'top', type: 'error', text: 'Vous devez renseigner le nom du projet.', timeout: '5000'});
    }
}
function openProject(){
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
    }

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send();
}
function loadProject(fileName){
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
    }

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
                    var n = noty({layout: 'top', type: 'error', text: 'Nous n\'arrivons pas à sauvegarder le projet.', timeout: '5000'});

                    currentProject.loadModal('hide');
                }
            }
        }

        OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        OAjax.send('nameProject=' + currentProject.name + '&contentFile=' + JSON.stringify(informations));
    }
    else
    {
        newProjectModal(false);
    }
}
function updateTextProject(){
    console.log('updateTextProject');

    if(currentProject.isCreated)
    {
        document.getElementById('currentProject').innerHTML = 'Projet : ' + currentProject.name + ', dernière sauvegarde : ' + currentProject.lastSave;
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
        fileE.setAttribute('onclick', 'fileProperties(' + fileId + ', ' + typeFile + ');');
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

function writeTextToCanvas(x, y){
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
function verifyFieldTextElement(){
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
    var currentItem = new FileList(newId, 'text', 0, nameText, 'png', new Uint8Array(arrayBuffer));
    currentItem.setDuration('00:00:20');

    console.log('currentItem ' + currentItem);
    tabListFiles.push(currentItem);

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', 'php/uploadPngTitle.php?u=User1&p=' + currentProject.name, true);
    OAjax.onreadystatechange = function() {
        if(OAjax.readyState == 4 && OAjax.status == 200) {
            console.log(OAjax.responseText);

            if (OAjax.responseText == 'true') {
                location.href = 'index';
            }
        }
    }

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send('imageDataURL=' + document.getElementById('textRender').toDataURL('image/png') + '&nameId=' + newId);

    document.getElementById('listFilesLib').innerHTML += '<a href="#" onclick="fileProperties(' + newId + ', \'text\');" class="list-group-item" id="libFile' + newId + '" idFile="' + newId + '"><h4 id="nameFile' + newId + '" class="list-group-item-heading"><span class="glyphicon glyphicon-text-width"></span> ' + compressName(nameText) + '</h4></a>';
}
function base64ToArrayBuffer(string_base64){
    var binary_string = window.atob(string_base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        var ascii = binary_string.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}
CanvasRenderingContext2D.prototype.clear = CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
        if (preserveTransform) {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
        }

        this.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (preserveTransform) {
            this.restore();
        }
    };
function fileProperties(id, type){
    console.log('fileProperties');

    $('#selectFileLib').modal('show');
    for(i=0;i<tabListFiles.length;i++)
    {
        if (tabListFiles[i].id == id)
        {
            type = tabListFiles[i].type;
        }
    }

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


    console.log('id '+id+ "Type !!!! "+type);
    getInfoForFileId(id, type);
}
function getInfoForFileId(id, type, mode){
    if (mode == "JSon")
    {
        for(i=0;i<tabListFiles.length;i++)
        {
            if (tabListFiles[i].id == id)
            {
                return tabListFiles[i];
            }
        }

    }
    else
    {
        for(i=0;i<tabListFiles.length;i++)
        {
            if (tabListFiles[i].id == id)
            {
                info = tabListFiles[i];
            }
        }
        console.log('yes');
        console.log(info.fileName);

        document.getElementById('libFileName').innerHTML = info.fileName;
        document.getElementById('libFileSize').innerHTML = info.size + ' Octets';
        document.getElementById('libFileFormat').innerHTML = info.format;
        document.getElementById('libFileDuration').innerHTML = info.duration;

        var preview;

        console.log(type);

        if(type == 'image' || type == 'text')
        {
            preview = '<img class="previewFileContent" src="http://clangue.net/testVideo/php/getFile.php?p='+currentProject.name+'&fileId='+info.id+'">';
        }
        else
        {
            preview = 'Non disponible';
        }

        document.getElementById('libFilePreview').innerHTML = preview;
    }
}
function editFileText(id){
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
function saveEditFileText(id){
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

    //TODO : add a function to reupload the file !
    tabListTextElements[posTabListTextElements].updateValuesElement(nameText, contentText, colorText, sizeText, posText);

    document.getElementById('nameFile' + id).innerHTML = nameText;
}
function editFileImage(id){
    console.log('editFileImage');
}
function removeFile(id){
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
function addTrack(){

    numberofTrack = tabListTracks.length;
    var nextId = 0;
    if (numberofTrack != 0)
    {
        var lastId = tabListTracks[numberofTrack-1].id;
        nextId = lastId+1;
    }

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
function addElement(id, idTrack){
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