/**
 * Created by Dylan on 10/02/2015.
 */

/* Fonction pour ajouter un fichier externe (aussi utilisée lors du chargement d'un projet), elle se présente en plusieurs parties et utilise
d'autres fonctions ainsi que pour les éléments vidéo/audio FFMPEG (donc le TerminalJS, ref. lib/TerminalJS/TerminalJS.js) */
function addFile(currentFile) {

    //Remplacement des minuscules par des majuscules et des accents pour simplifier
    var fileName = currentFile.name.deleteAccent().replace(new RegExp(' ', 'g'), '_');

    var typeFile = getTypeFile(fileName);

    rLog('-FILE- add [fileName: ' + currentFile.name + '][type: ' + typeFile + ']');

    if (typeFile != 'ERROR') {
        var fileId = (currentProject.tabListFiles.length > 0) ? (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id + 1) : 0;
        var fileUId = uId();

        var currentItem = new File(fileId, fileUId, typeFile, currentFile.size, fileName, fileName.split('.').pop().toUpperCase());

        currentProject.tabListFiles.push(currentItem);

        //Ajout graphique et upload du fichier
        addFileList(fileId, fileName, typeFile);
        uploadFile(fileId, fileUId, fileName, currentFile, 'FILE', currentItem.format);

        if (typeFile == TYPE.IMAGE) {
            //Définition des propriété d'une image
            currentItem.makeVideo();
            currentItem.setDuration('00:00:20');
            currentItem.setThumbnailImage(window.URL.createObjectURL(new Blob([currentFile])));

            uploadFile(fileId, fileUId, fileName, currentFile, 'THUMBNAIL_I', currentItem.format);
        }
        else
        {
            //Cette étape est pour tous les fichiers externes compatibles sauf les images
            var reader = new FileReader();

            reader.onload = function (e) {
                sLoadM();
                fileProcessing(fileId, e.target.result);
            };

            reader.readAsArrayBuffer(currentFile);
        }
    }
    else
    {
        noty({
            layout: 'topRight',
            type: 'error',
            text: 'Erreur, ce fichier n\'est pas compatible avec le système.',
            timeout: '5000'
        });
    }
}

function updateDataFileModal(id) {
    var fileType = currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)].type;

    if(fileType == TYPE.TEXT) {
        editFileText(id);
        saveTextElement();
    }
    else
    {
        document.getElementById('fileUploadLoader').setAttribute('onchange', 'updateDataFile(' + id + ', this.files[0])');

        $('#uploadFileModal').modal('show');
    }
}

function updateDataFile(id, file) {
    var fileClass = currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)];
    var fileName = file.name.deleteAccent().replace(new RegExp(' ', 'g'), '_');

    var typeFile = getTypeFile(fileName);

    if(fileName == fileClass.fileName && typeFile == fileClass.type) {
        $('#uploadFileModal').modal('hide');

        uploadFile(id, fileClass.uId, fileName, file, 'FILE', fileClass.format);

        if(typeFile == TYPE.IMAGE) {
            fileClass.setThumbnailImage(window.URL.createObjectURL(new Blob([file])));

            uploadFile(id, fileClass.uId, fileName, file, 'THUMBNAIL_I', fileClass.format);
        }
        else
        {
            var reader = new FileReader();

            reader.onload = function (e) {
                sLoadM();
                fileProcessing(id, e.target.result);
            };

            reader.readAsArrayBuffer(file);
        }
    }
    else
    {
        noty({
            layout: 'topRight',
            type: 'error',
            text: 'Erreur, ce fichier ne correspond pas aux propriétéx de l\'ancien fichier.',
            timeout: '5000'
        });
    }
}

//Utilisation de ffmpeg pour connaître la durée mais aussi le type Vidéo/Audio du fichier
function fileProcessing(fileId, arrayBuffer)
{
    var excludedFromProcessing = ["ogg", "wav", "oga", "mp3"];
    currentProject.switchAutoSave();

    var fileClass = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];
    var elementData = new Uint8Array(arrayBuffer);

    terminal.Files.push({name: fileClass.fileName, data: elementData});

    terminal.processCmd("ffmpeg -i " + fileClass.fileName, function (e, index) {

        var message = e.data;

        if (message.type == "stdout") {
            console.log(message.text);
            if (message.text.substring(0, 11) == "  Duration:") {
                var durationString = message.text;
                currentProject.tabListFiles[currentProject.tabListFiles.length - 1].setDuration(durationString.substring(11, durationString.indexOf(',')).replace(' ', ''))
            }
            // "    Stream #0:0: Audio: pcm_s16le ([1][0][0][0] / 0x0001), 22050 Hz, mono, s16, 352 kb/s"
            if (message.text.substring(0, 10) == "    Stream") {
                if (message.text.search("Audio") != -1) {
                    console.log("audio");
                    currentProject.tabListFiles[currentProject.tabListFiles.length - 1].makeAudio();
                }

                if (message.text.search("Video") != -1) {
                    console.log("video");
                    if(fileClass.type != TYPE.AUDIO) {
                        currentProject.tabListFiles[currentProject.tabListFiles.length - 1].makeVideo();
                    }
                }

            }

        }
        else if (message.type == "stop") {
            console.log("Executed in " + message.time + "ms");
            terminal.Workers[index].worker.terminate();

            if (fileClass.type == TYPE.VIDEO) {
                terminal.processCmd("ffmpeg -i " + fileClass.fileName + " -f image2 -vf scale=-1:50 -an -ss " + Math.floor(timeToSeconds(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].duration) / 2) + " thumbnail.jpg", function (e, index) {

                    var message = e.data;

                    if (message.type == "stdout") {
                        console.log(message.text);
                    }
                    else if (message.type == "stop") {
                        console.log("Executed in " + message.time + "ms");
                        terminal.Workers[index].worker.terminate();

                        if (message.hasOwnProperty("data")) {
                            window.URL = window.URL || window.webkitURL;
                            var buffers = message.data;
                            buffers.forEach(function (file) {
                                console.log('finish');

                                var blob = new Blob([file.data]);

                                currentProject.tabListFiles[currentProject.tabListFiles.length - 1].setThumbnailImage(window.URL.createObjectURL(blob));

                                uploadFile(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id, currentProject.tabListFiles[currentProject.tabListFiles.length - 1].uId, fileClass.fileName, blob, 'THUMBNAIL_I', currentProject.tabListFiles[currentProject.tabListFiles.length - 1].format);
                                if (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].isAudio)
                                {
                                    terminal.processCmd("ffmpeg -i " + fileClass.fileName + " audioDat.wav", function (e, index) {

                                        var message = e.data;

                                        if (message.type == "stdout") {
                                            console.log(message.text);
                                        }
                                        else if (message.type == "stop") {
                                            console.log("Executed in " + message.time + "ms");
                                            terminal.Workers[index].worker.terminate();

                                            if (message.hasOwnProperty("data")) {
                                                window.URL = window.URL || window.webkitURL;
                                                var buffers = message.data;
                                                buffers.forEach(function (file) {
                                                    var blob = new Blob([file.data]);
                                                    var audioUrl = URL.createObjectURL(blob);
                                                    // create audio waveform
                                                    var wavesurfer = Object.create(WaveSurfer);
                                                    wavesurfer.on('ready', function () {
                                                        //wavesurfer.play();
                                                        URL.revokeObjectURL(audioUrl);
                                                        var canvas = findFirstDescendant("waveform", "canvas");
                                                        var blob = dataUrlToBlob(canvas.toDataURL('image/png'));

                                                        url = URL.createObjectURL(blob);
                                                        console.log("wavefor URL", url);
                                                        uploadFile(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id, currentProject.tabListFiles[currentProject.tabListFiles.length - 1].uId, fileClass.fileName, blob, 'THUMBNAIL_A', currentProject.tabListFiles[currentProject.tabListFiles.length - 1].format);
                                                        currentProject.tabListFiles[currentProject.tabListFiles.length - 1].setThumbnailAudio(url);

                                                        wavesurfer.destroy();
                                                    });

                                                    wavesurfer.init({
                                                        container     : document.querySelector('#waveform'),
                                                        waveColor     : '#4d4d4d',
                                                        progressColor : '#4d4d4d'
                                                    });
                                                    wavesurfer.load(audioUrl);
                                                    hLoadM();
                                                    currentProject.switchAutoSave();
                                                });
                                            }
                                        }
                                    });
                                }
                                else{
                                    hLoadM();
                                    currentProject.switchAutoSave();

                                }
                            });
                        }
                    }
                });
            }
            else
            {
                if (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].isAudio && excludedFromProcessing.lastIndexOf(fileClass.fileName.split(".").pop().toLowerCase()) == -1)
                {
                    terminal.processCmd("ffmpeg -i " + fileClass.fileName + " audioDat.wav", function (e, index) {

                        var message = e.data;

                        if (message.type == "stdout") {
                            console.log(message.text);
                        }
                        else if (message.type == "stop") {
                            console.log("Executed in " + message.time + "ms");
                            terminal.Workers[index].worker.terminate();

                            if (message.hasOwnProperty("data")) {
                                window.URL = window.URL || window.webkitURL;
                                var buffers = message.data;
                                buffers.forEach(function (file) {
                                    var blob = new Blob([file.data]);
                                    var audioUrl = URL.createObjectURL(blob);
                                    // create audio waveform
                                    var wavesurfer = Object.create(WaveSurfer);
                                    wavesurfer.on('ready', function () {
                                        //wavesurfer.play();
                                        URL.revokeObjectURL(audioUrl);
                                        var canvas = findFirstDescendant("waveform", "canvas");
                                        var blob = dataUrlToBlob(canvas.toDataURL('image/png'));

                                        url = URL.createObjectURL(blob);
                                        console.log("wavefor URL", url);
                                        uploadFile(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id, currentProject.tabListFiles[currentProject.tabListFiles.length - 1].uId, fileClass.fileName, blob, 'THUMBNAIL_A', currentProject.tabListFiles[currentProject.tabListFiles.length - 1].format);
                                        currentProject.tabListFiles[currentProject.tabListFiles.length - 1].setThumbnailAudio(url);

                                        wavesurfer.destroy();
                                    });

                                    wavesurfer.init({
                                        container     : document.querySelector('#waveform'),
                                        waveColor     : '#4d4d4d',
                                        progressColor : '#4d4d4d'
                                    });
                                    wavesurfer.load(audioUrl);
                                    hLoadM();
                                    currentProject.switchAutoSave();
                                });
                            }
                        }
                    });
                }
                else if (excludedFromProcessing.lastIndexOf(fileClass.fileName.split(".").pop().toLowerCase()) != -1)
                {
                    var wavesurfer = Object.create(WaveSurfer);
                    var blob = new Blob([arrayBuffer]);
                    var url = URL.createObjectURL(blob);

                    wavesurfer.on('ready', function () {
                        //wavesurfer.play();
                        var canvas = findFirstDescendant("waveform", "canvas");
                        var blob = dataUrlToBlob(canvas.toDataURL('image/png'));

                        url = URL.createObjectURL(blob);
                        console.log("wavefor URL", url);
                        uploadFile(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id, currentProject.tabListFiles[currentProject.tabListFiles.length - 1].uId, fileClass.fileName, blob, 'THUMBNAIL_A', currentProject.tabListFiles[currentProject.tabListFiles.length - 1].format);
                        currentProject.tabListFiles[currentProject.tabListFiles.length - 1].setThumbnailAudio(url);

                        wavesurfer.destroy();
                        hLoadM();
                    });

                    wavesurfer.init({
                        container     : document.querySelector('#waveform'),
                        waveColor     : '#4d4d4d',
                        progressColor : '#4d4d4d'
                    });
                    wavesurfer.load(url);
                }
                else{
                    hLoadM();
                    currentProject.switchAutoSave();
                }
            }
        }
    });
}

//Détection des fichiers compatibles (ref. addFile)
function getTypeFile(fileName) {
    console.log(fileName);

    var extension = fileName.split('.').reverse()[0];
    console.log(extension);

    var tabExtensionAudio = ['mp3', 'wav', 'wma', 'oga', 'ogg'];
    var tabExtensionVideo = ['avi', 'mp4', 'wmv', 'flv', 'webm', 'ogv', 'mov' ];
    var tabExtensionImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

    if (tabExtensionAudio.lastIndexOf(extension.toLowerCase()) != -1) {
        return TYPE.AUDIO;
    }
    else if (tabExtensionVideo.lastIndexOf(extension.toLowerCase()) != -1) {
        return TYPE.VIDEO;
    }
    else if (tabExtensionImage.lastIndexOf(extension.toLowerCase()) != -1) {
        return TYPE.IMAGE;
    }
    else {
        return 'ERROR';
    }
}

//Ajout graphique du fichier
function addFileList(fileId, fileName, typeFile) {
    if (currentProject.tabListFiles.length < 2) {
        eId('listFiles').innerHTML = '';
    }

    var iconName = '';

    switch (typeFile) {
        case TYPE.AUDIO :
            iconName = 'glyphicon-music';
            break;
        case TYPE.VIDEO :
            iconName = 'glyphicon-film';
            break;
        case TYPE.IMAGE :
            iconName = 'glyphicon-picture';
            break;
        case TYPE.TEXT:
            iconName = 'glyphicon-text-width';
            break;
        default :
            iconName = 'glyphicon-file';
    }

    var toolsFile = 'Ready!';

    if(!isUploadedFile(fileId)) {
        toolsFile = '<a href="#" onclick="updateDataFileModal(' + fileId + ');"><span class="text-danger">Erreur d\'envoi</span></a>';
    }

    var fileE = document.createElement('a');
    fileE.id = 'file' + fileId;
    fileE.draggable = true;
    fileE.style.cursor = 'grab';
    fileE.ondragstart = selectFile;
    fileE.ondragend = deselectFile;
    fileE.classList.add('list-group-item');
    fileE.innerHTML = '<h5 id="nameFile' + fileId + '" class="list-group-item-heading"><span class="glyphicon ' + iconName + '"></span> <a href="#" onclick="fileProperties(' + fileId + ');">' + compressName(fileName) + '</a></h5><div id="toolsFile' + fileId + '">' + toolsFile + '</div>';

    eId('listFiles').appendChild(fileE);
}

//Drag & drop du fichier sur les pistes avec mémorisation de l'id du fichier lors du déplacement
function selectFile(e) {
    this.classList.add('active');

    e.dataTransfer.setData('fileId', parseInt(this.id.replace('file', '')));
}

function deselectFile(e) {
    this.classList.remove('active');
}


//Informations sur le fichier avec possibilité de modification si c'est du texte
function fileProperties(id) {
    var file = currentProject.tabListFiles[id];

    eId('nameFileP').innerHTML = file.fileName;
    eId('typeFileP').innerHTML = typeFile(file.type);
    eId('sizeFileP').innerHTML = sizeFile(file.size);
    eId('formatFileP').innerHTML = file.format;
    eId('durationFileP').innerHTML = file.duration;

    var preview = '';

    if(file.isVideo) {
        preview = '<a href="#" class="thumbnail"><img class="previewFileContent" src="' + file.thumbnail.i + '"></a>';
    }

    if(file.isAudio) {
        preview += '<a href="#" class="thumbnail"><img class="previewAudioFileContent" src="' + file.thumbnail.a + '"></a>';
    }

    eId('previewFileP').innerHTML = preview;

    if (file.type == TYPE.TEXT) {
        eId('fileEditButton').setAttribute('onclick', 'editFileText(' + id + ');');
        eId('fileEditButton').style.display = '';
    }
    else {
        eId('fileEditButton').removeAttribute('onclick');
        eId('fileEditButton').style.display = 'none';
    }

    eId('fileRemoveButton').setAttribute('onclick', 'removeFile(' + id + ');');

    $('#filePropertiesModal').modal('show');
}

function typeFile(type) {
    switch(type) {
        case TYPE.VIDEO:
            return 'Vidéo';
        case TYPE.IMAGE:
            return 'Image';
        case TYPE.TEXT:
            return 'Texte';
        case TYPE.AUDIO:
            return 'Audio';
        default:
            return 'Inconnu';
    }
}

//Taille du fichier en Octets, Mo, ou Octets pour simplifier la lecture
function sizeFile(size) {
    if(size > 1000)
    {
        return Math.floor(size/1000) + ' Ko';
    }
    else if(size > 1000000)
    {
        return Math.flooor(size/1000000) + ' Mo';
    }
    else
    {
        return size + ' Octets';
    }
}


//Suppression du fichier
function removeFile(id) {
    $('#filesPropertiesModal').modal('hide');

    currentProject.tabListFiles[id] = null;
    currentProject.tabListFiles.remove(id);

    eId('listFiles').removeChild(eId('file' + id));
}

//Fonction pour envoyer le fichier, utilisation d'un objet FileUpload pour connaître l'avancement et permettre plusieurs envois en même temps
function uploadFile(id, uId, name, file, type, format) {
    rLog('-FILE- upload : start [id: ' + id + '][uId: ' + uId + '][name: ' + name + '][type: ' + type + '][format: ' + format + ']');

    if(id >= 0) {
        eId('toolsFile' + id).innerHTML = 'Sending ...';
    }

    eId('countUploads').innerHTML = parseInt(eId('countUploads').innerHTML) + 1;

    var idFileUpload = (currentProject.tabFilesUpload.length > 0) ? (currentProject.tabFilesUpload[currentProject.tabFilesUpload.length - 1].id + 1) : 0;
    var fileUpload = new FileUpload(idFileUpload, id, name, type);

    currentProject.tabFilesUpload.push(fileUpload);

    if(currentProject.tabFilesUpload.length < 2)
    {
        eId('listUploads').innerHTML = '';
    }

    //Ajout graphique
    var element = document.createElement('div');
    element.classList.add('list-group-item');
    element.innerHTML = '<h4 class="list-group-item-heading">' + fileUpload.name + ' - ' + fileUpload.type + '</h4>' +
    '<div id="contentFileUpload' + idFileUpload + '" class="list-group-item-text">' +
    '<div class="progress">' +
    '<div id="progressFile' + idFileUpload + '" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
    '<span class="sr-only">0% Complete</span>' +
    '</div>' +
    '</div>' +
    '</div>';

    eId('listUploads').appendChild(element);

    var formData = new FormData();
    formData.append('fileData', file);

    var url = 'php/uploadFile.php?projectName=' + currentProject.name + '&fileUId=' + uId + '&typeFile=' + type + '&formatFile=' + format;

    var xhr = createCORSRequest('POST', url);

    if (!xhr) {
        noty({layout: 'topRight', type: 'error', text: 'Erreur, navigateur incompatible avec les requêtes CORS.', timeout: '5000'});
        return;
    }

    if (xhr.upload) {
        //Progression de l'envoi
        xhr.upload.onprogress = function (e) {
            var done = e.position || e.loaded,
                total = e.totalSize || e.total;

            fileUpload.setProgress((Math.floor(done / total * 1000) / 10));

            eId('progressFile' + idFileUpload).style.width = fileUpload.progress + '%';

            //console.log((Math.floor(done / total * 1000) / 10));
        };
    }

    xhr.onreadystatechange = function (e) {
        if (4 == this.readyState) {
            rLog('finish upload ' + this.responseText);

            //Si le fichier est bien envoyé : changement de la valeur isUpload et notification à l'utilisateur sinon bouton permettant de réessayer l'envoi du fichier
            if (this.responseText != 'true') {
                rLog('-FILE- upload : end|false [id: ' + id + '][uId: ' + uId + '][name: ' + name + '][type: ' + type + '][format: ' + format + ']');

                noty({
                    layout: 'topRight',
                    type: 'error',
                    text: 'Nous n\'avons pas réussi à envoyer ce fichier',
                    timeout: '5000'
                });

                if(id >= 0)
                {
                    eId('contentFileUpload' + idFileUpload).innerHTML = '<span class="text-danger">Impossible d\'envoyer le fichier.</span>';
                    eId('toolsFile' + id).innerHTML = '<a href="#" onclick="updateDataFileModal(' + id + ');"><span class="text-danger">Erreur d\'envoi</span></a>';
                }

            }
            else {
                rLog('-FILE- upload : end|true [id: ' + id + '][uId: ' + uId + '][name: ' + name + '][type: ' + type + '][format: ' + format + ']');

                if(id >= 0) {
                    var text = '';

                    if(type == 'THUMBNAIL_I')
                    {
                        currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)].isUploaded.i = 1;
                        text = 'La miniature vidéo du fichier ' + name + ' a bien été envoyée.';
                    }
                    else if(type == 'THUMBNAIL_A')
                    {
                        currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)].isUploaded.a = 1;
                        text = 'La miniature audio du fichier ' + name + ' a bien été envoyée.';
                    }
                    else if (type == 'RENDER')
                    {
                        text = 'Le fichier de rendu à bien été envoyée. Il devrait être traité d\'ici peu de temps';
                    }
                    else
                    {
                        currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)].isUploaded.file = 1;
                        text = 'Le fichier ' + name + ' a bien été envoyé.';
                    }

                    noty({
                        layout: 'topRight',
                        type: 'success',
                        text: text,
                        timeout: '5000'
                    });

                    if(isUploadedFile(id))
                    {
                        eId('toolsFile' + id).innerHTML = 'Ready!';
                    }
                }
            }

            eId('countUploads').innerHTML = parseInt(eId('countUploads').innerHTML) - 1;
        }
    };

    xhr.send(formData);
}

//Vérification que tous les fichiers (thumbnail vidéo, thumbnail audio, fichier) ont été envoyés
function isUploadedFile(id) {
    var file = currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)];

    return !(file.isUploaded.i == 0 || file.isUploaded.a == 0 || file.isUploaded.file == 0);
}

function isAllUploaded() {
    var isUploaded = true;

    for(var i = 0; i < currentProject.tabListFiles.length; i++) {
        if(currentProject.tabListFiles[i].isUploaded.i == 0 || currentProject.tabListFiles[i].isUploaded.a == 0 || currentProject.tabListFiles[i].isUploaded.file == 0)
            isUploaded = false;
    }

    return isUploaded;
}

//Affiche le gestionnaire d'envoi des fichiers
function uploadManagerModal() {
    $('#uploadManagerModal').modal('show');
}