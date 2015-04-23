/**
 * Created by Dylan on 14/02/2015.
 */

function newTextElement(){
    console.log('newTextElement');

    var id = (currentProject.tabListFiles.length > 0) ? (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id + 1) : 0;

    currentManageTextElement.newTextElement(id);

    $('#textElementModal').modal('show');
}

function editFileText(id){
    var propertiesTextElement = currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)].properties;

    console.log(propertiesTextElement);

    currentManageTextElement.editTextElement(propertiesTextElement.id, id, propertiesTextElement.text, propertiesTextElement.properties);

    $('#textElementModal').modal('show');
}

function saveTextElement() {
    var textElement = currentManageTextElement.gInformationsTextElement();
    var blob = dataUrlToBlob(document.getElementById('textElement').toDataURL('image/png'));

    if(currentManageTextElement.isEditing)
    {
        var row = rowById(currentManageTextElement.fileId, currentProject.tabListFiles);
        var file = currentProject.tabListFiles[rowById(currentManageTextElement.fileId, currentProject.tabListFiles)];

        file.size = blob.size;

        file.properties.text = textElement.text;
        file.properties.properties = textElement.properties;

        file.setThumbnailImage(window.URL.createObjectURL(blob));

        for(var i = 0; i < currentProject.tabListTracks.length; i++) {
            for(var x = 0; x < currentProject.tabListTracks[i].tabElements.length; x++) {
                if(currentProject.tabListTracks[i].tabElements[x].fileId == file.id) {
                    updateThumbnail(currentProject.tabListTracks[i], x, file.thumbnail.i);
                }
            }
        }

        uploadFile(currentManageTextElement.fileId, file.uId, file.fileName, blob, 'FILE', 'PNG');
        uploadFile(currentManageTextElement.fileId, file.uId, file.fileName, blob, 'THUMBNAIL_I', 'PNG');
    }
    else
    {
        var fileId = (currentProject.tabListFiles.length > 0) ? (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id + 1) : 0;
        var fileUId = uId();

        var fileName = 'Text ' + fileId;

        var currentItem = new File(fileId, fileUId, TYPE.TEXT, blob.size, ('Text ' + fileId), 'PNG');
        currentItem.makeVideo();
        currentItem.setDuration('00:00:20');

        currentItem.setProperties(new TextElement(textElement.id, textElement.text, textElement.properties));
        currentItem.setThumbnailImage(window.URL.createObjectURL(blob));

        console.log('currentItem ' + currentItem);
        currentProject.tabListFiles.push(currentItem);

        addFileList(fileId, fileName, TYPE.TEXT);

        uploadFile(fileId, fileUId, fileName, blob, 'FILE', 'PNG');
        uploadFile(fileId, fileUId, fileName, blob, 'THUMBNAIL_I', 'PNG');
    }

    var n = noty({layout: 'topRight', type: 'success', text: 'Le texte a bien été sauvegardé.', timeout: '5000'});

    $('#textElementModal').modal('hide');
}