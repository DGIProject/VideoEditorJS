/**
 * Created by Dylan on 10/02/2015.
 */

function addFile() {
    currentProject.stopAddFileTrack();

    var currentFile = document.getElementById('fileLoader').files[0];
    console.log(currentFile);

    var typeFile = getTypeFile(currentFile.name);
    console.log(typeFile);

    if (typeFile != 'ERROR') {
        var fileId = (currentProject.tabListFiles.length > 0) ? (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id + 1) : 0;

        if (typeFile == TYPE.IMAGE) {
            var currentItem = new File(fileId, typeFile, currentFile.size, currentFile.name, currentFile.name.split('.').pop());
            currentItem.makeVideo();
            currentItem.setDuration('00:00:20');
            currentItem.setThumbnailImage(window.URL.createObjectURL(new Blob([currentFile])));

            currentItem.uploadThumbnail.i = 100;
            currentItem.uploadThumbnail.a = 100;

            currentProject.tabListFiles.push(currentItem);

            addFileList(fileId, currentFile.name, typeFile);
            uploadFile(fileId, (currentProject.tabListFiles.length - 1), currentFile, 'FILE');
        }
        else {
            var reader = new FileReader();

            reader.onload = function (e) {
                loadM();

                var data = e.target.result;

                var ElementData = new Uint8Array(data);

                terminal.Files.push({name: currentFile.name, data: ElementData});

                terminal.processCmd("ffmpeg -i " + currentFile.name, function (e, index) {

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
                                currentProject.tabListFiles[currentProject.tabListFiles.length - 1].makeVideo();
                            }

                        }

                    }
                    else if (message.type == "stop") {
                        console.log("Executed in " + message.time + "ms");
                        terminal.Workers[index].worker.terminate();
                        // this.Workers.remove(index);
                        terminal.processCmd("ffmpeg -i " + currentFile.name + " -c:a pcm_s16le audioDat.wav", function (e, index) {

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

                                        terminal.loadFile(window.URL.createObjectURL(blob), "audioDat.wav", function (onEnd) {

                                            var sizeX = currentProject.tabListFiles[currentProject.tabListFiles.length - 1].getDurationInSecond();

                                            var gnuplotScript = "set terminal svg size " + sizeX + ",119;" +
                                                "set output 'out.svg';" +
                                                "unset key;" +
                                                "unset tics;" +
                                                "unset border;" +
                                                "set lmargin 0;" +
                                                "set rmargin 0;" +
                                                "set tmargin 0;" +
                                                "set bmargin 0;" +
                                                "plot 'audioDat.wav' binary filetype=bin format='%int16' endian=little array=1:0 with lines;";

                                            var buf = new ArrayBuffer(gnuplotScript.length * 2); // 2 bytes for each char
                                            var bufView = new Uint16Array(buf);
                                            for (var i = 0, strLen = gnuplotScript.length; i < strLen; i++) {
                                                bufView[i] = gnuplotScript.charCodeAt(i);
                                            }
                                            var name = "script" + Date.now();

                                            terminal.Files.push({name: name, data: bufView});
                                            terminal.processCmd("gnuplot " + name + " audioDat.wav", function (e, i) {
                                                console.log(e.data)
                                                if (e.data.type == "stop") {
                                                    console.log("Executed in " + message.time + "ms");
                                                    terminal.Workers[i].worker.terminate();

                                                    if (e.data.hasOwnProperty("data")) {
                                                        window.URL = window.URL || window.webkitURL;
                                                        console.log("Blob URL", window.URL.createObjectURL(e.data.data));
                                                        /* To transform SVG to png */
                                                        var canvas = document.createElement("canvas");
                                                        canvas.setAttribute("id", "canvasTest");
                                                        canvas.style.display = "none";
                                                        canvas.width = sizeX;
                                                        canvas.height = 119;
                                                        document.appendChild(canvas);
                                                        var context = canvas.getContext("2d");
                                                        var img = new Image();
                                                        var text;
                                                        img.onload = function () {
                                                            context.drawImage(img, 0, 0);
                                                            text = canvas.toDataURL("image/png");
                                                            console.log(text);
                                                        };
                                                        img.src = window.URL.createObjectURL(e.data.data);
                                                        /*----------*/
                                                        currentProject.tabListFiles[currentProject.tabListFiles.length - 1].thumbnail.a = window.URL.createObjectURL(e.data.data) | text;
                                                    }
                                                    terminal.Files.remove(terminal.Files.length - 1);
                                                    terminal.Files.remove(terminal.Files.length - 2);
                                                }
                                            });


                                        });
                                    });
                                }
                            }
                        });

                        if (typeFile == TYPE.VIDEO) {
                            terminal.processCmd("ffmpeg -i " + currentFile.name + " -f image2 -vf scale=-1:50 -an -ss " + Math.floor(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].getDurationInSecond() / 2) + " thumbnail.jpg", function (e, index) {

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

                                            addFileList(fileId, currentFile.name, typeFile);
                                            uploadFile(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id, currentProject.tabListFiles.length - 1, blob, 'THUMBNAIL_I');
                                            uploadFile(currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id, currentProject.tabListFiles.length - 1, currentFile, 'FILE');
                                            loadM();
                                        });
                                    }
                                }
                            });
                        }
                    }
                });

                var currentItem = new File(fileId, typeFile, currentFile.size, currentFile.name, currentFile.name.split('.').pop());
                console.log('currentItem ' + currentItem);

                currentProject.tabListFiles.push(currentItem);
            };

            reader.readAsArrayBuffer(currentFile);
        }

        console.log('next');
    }
    else {
        var n = noty({
            layout: 'topRight',
            type: 'error',
            text: 'Erreur, ce fichier n\'est pas compatible avec le système.',
            timeout: '5000'
        });
    }
}

function getTypeFile(fileName) {
    console.log(fileName);

    var extension = fileName.split('.').reverse()[0];
    console.log(extension);

    var tabExtensionAudio = ['mp3', 'wav', 'wmv'];
    var tabExtensionVideo = ['avi', 'mp4', 'wma', 'flv', 'webm'];
    var tabExtensionImage = ['png', 'jpg', 'jpeg', 'gif'];

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

function addFileList(fileId, fileName, typeFile) {
    if (currentProject.tabListFiles.length < 2) {
        document.getElementById('listFiles').innerHTML = '';
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

    var fileE = document.createElement('a');
    fileE.id = 'file' + fileId;
    fileE.style.cursor = 'pointer';
    fileE.onclick = fileProperties;
    fileE.onmousedown = selectFile;
    fileE.classList.add('list-group-item');
    fileE.innerHTML = '<h4 id="nameFile' + fileId + '" class="list-group-item-heading"><span class="glyphicon ' + iconName + '"></span> ' + compressName(fileName) + '</h4><div id="toolsFile' + fileId + '"><div class="progress"><div id="progressFile' + fileId + '" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"><span class="sr-only">0% Complete</span></div></div></div>';

    document.getElementById('listFiles').appendChild(fileE);
}

function selectFile() {
    console.log('selectFile');
    console.log(this.id);

    var id = this.id.replace('file', '');
    var row = rowById(id, currentProject.tabListFiles);

    currentProject.tabListFiles[row].isSelected = true;
}

function deselectFiles() {
    console.log('deselectFiles');

    for (var i = 0; i < currentProject.tabListFiles.length; i++) {
        currentProject.tabListFiles[i].isSelected = false;
    }
}

function fileProperties() {
    console.log('fileProperties');

    var id = this.id.replace('file', '');

    var fileInfo = currentProject.tabListFiles[id];
    var type = currentProject.tabListFiles[id].type;

    document.getElementById('FileListName').innerHTML = fileInfo.fileName;
    document.getElementById('FileListSize').innerHTML = fileInfo.size + ' Octets';
    document.getElementById('FileListFormat').innerHTML = fileInfo.format;
    document.getElementById('FileListDuration').innerHTML = fileInfo.duration;

    var preview;

    if (type == TYPE.TEXT || type == TYPE.IMAGE || type == TYPE.VIDEO) {
        preview = '<img class="previewFileContent" src="' + fileInfo.thumbnail.i + '">';
    }
    else {
        preview = 'Non disponible';
    }

    document.getElementById('FileListPreview').innerHTML = preview;

    if (type == TYPE.TEXT) {
        document.getElementById('fileEditButton').setAttribute('onclick', 'editFileText(' + id + ');');
        document.getElementById('fileEditButton').style.display = '';
    }
    else if (type == TYPE.IMAGE) {
        document.getElementById('fileEditButton').setAttribute('onclick', 'editFileImage(' + id + ');');
        document.getElementById('fileEditButton').style.display = 'none';
    }
    else {
        document.getElementById('fileEditButton').removeAttribute('onclick');
        document.getElementById('fileEditButton').style.display = 'none';
    }

    document.getElementById('fileRemoveButton').setAttribute('onclick', 'removeFile(' + id + ');');

    $('#filePropertiesModal').modal('show');
}

function editFileImage(id) {
    console.log('editFileImage');
}

function removeFile(id) {
    $('#filesPropertiesModal').modal('hide');

    currentProject.tabListFiles[id] = null;
    currentProject.tabListFiles.remove(id);

    document.getElementById('listFiles').removeChild(document.getElementById('file' + id));
}

//UPLOAD
function uploadFile(id, row, file, type) {
    currentProject.currentUploads++;

    var formData = new FormData();
    formData.append('fileData', file);

    var xhr = new XMLHttpRequest();

    if (xhr.upload) {
        xhr.upload.onprogress = function (e) {
            var done = e.position || e.loaded,
                total = e.totalSize || e.total;

            console.log(row);

            if (type == 'FILE') {
                currentProject.tabListFiles[row].uploadFile = (Math.floor(done / total * 1000) / 10)
            }
            else if (type == 'THUMBNAIL_I') {
                currentProject.tabListFiles[row].uploadThumbnail.i = (Math.floor(done / total * 1000) / 10);
            }
            else {
                currentProject.tabListFiles[row].uploadThumbnail.a = (Math.floor(done / total * 1000) / 10);
            }

            console.log((Math.floor(done / total * 1000) / 10));

            //document.getElementById('progressFile' + id).style.width = (Math.floor(done / total * 1000) / 10) + '%';
        };
    }

    xhr.onreadystatechange = function (e) {
        if (4 == this.readyState) {
            console.log('xhr upload complete ' + this.responseText);

            currentProject.currentUploads--;

            if (this.responseText != 'true') {
                currentProject.tabFilesUpload[currentProject.tabFilesUpload.length] = [id, file];

                var n = noty({
                    layout: 'top',
                    type: 'error',
                    text: 'Nous n\'avons pas réussi à envoyer ce fichier',
                    timeout: '5000'
                });

                var buttonRetryUpload = document.createElement('button');
                buttonRetryUpload.setAttribute('type', 'button');
                buttonRetryUpload.setAttribute('onclick', 'uploadFile(' + id + ', \'' + file + '\', \'' + type + '\');');
                buttonRetryUpload.setAttribute('class', 'btn btn-danger btn-block');
                buttonRetryUpload.innerHTML = 'Réessayer';

                document.getElementById('toolsFile' + id).innerHTML = '';
                document.getElementById('toolsFile' + id).appendChild(buttonRetryUpload);
            }
            else {
                var n = noty({
                    layout: 'top',
                    type: 'success',
                    text: 'Le fichier ' + file.name + ' a bien été envoyé.',
                    timeout: '5000'
                });

                document.getElementById('toolsFile' + id).innerHTML = 'Ready!';
            }
        }
    };

    xhr.open('POST', 'php/uploadFile.php?projectName=' + currentProject.name + '&fileId=' + id + '&typeFile=' + type, true);
    xhr.send(formData);
}

function uploadAllFiles() {
    if (currentProject.tabFilesUpload.length > 0) {
        console.log('filesToUpload');

        for (var i = 0; i < currentProject.tabFilesUpload.length; i++) {
            uploadFile(currentProject.tabFilesUpload[i][0], currentProject.tabFilesUpload[i][1]);
        }

        currentProject.tabFilesUpload = [];
    }
    else {
        console.log('notFilesToUpload');
    }
}