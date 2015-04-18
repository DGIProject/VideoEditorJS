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

    if(currentManageTextElement.isEditing)
    {
        var row = rowById(currentManageTextElement.fileId, currentProject.tabListFiles);
        var file = currentProject.tabListFiles[rowById(currentManageTextElement.fileId, currentProject.tabListFiles)];

        document.getElementById('textElement').toBlob(function(blob) {
            file.size = blob.size;
            file.properties.updateValues(textElement.text, textElement.properties);
            file.setThumbnailImage(window.URL.createObjectURL(blob));

            uploadFile(currentManageTextElement.fileId, file.fileName, blob, 'FILE');
        }, 'image/png');
    }
    else
    {
        var fileId = (currentProject.tabListFiles.length > 0) ? (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id + 1) : 0;
        var fileName = 'Text ' + fileId;

        var currentItem = new File(fileId, TYPE.TEXT, 0, ('Text ' + fileId), 'png');
        currentItem.makeVideo();
        currentItem.setDuration('00:00:20');

        /*
        document.getElementById('textElement').toBlob(function(blob) {
            currentItem.size = blob.size;
            currentItem.setProperties(new TextElement(textElement.id, textElement.text, textElement.properties));
            currentItem.setThumbnailImage(window.URL.createObjectURL(blob));

            console.log('currentItem ' + currentItem);
            currentProject.tabListFiles.push(currentItem);

            addFileList(fileId, fileName, TYPE.TEXT);
            uploadFile(fileId, fileName, blob, 'FILE');
        }, 'image/png');
        */

        var blob = dataUrlToBlob(document.getElementById('textElement').toDataURL('image/png'));

        currentItem.size = blob.size;
        currentItem.setProperties(new TextElement(textElement.id, textElement.text, textElement.properties));
        currentItem.setThumbnailImage(window.URL.createObjectURL(blob));

        console.log('currentItem ' + currentItem);
        currentProject.tabListFiles.push(currentItem);

        addFileList(fileId, fileName, TYPE.TEXT);

        uploadFile(fileId, fileName, blob, 'FILE');
        uploadFile(fileId, fileName, blob, 'THUMBNAIL_I');
    }

    var n = noty({layout: 'topRight', type: 'success', text: 'Le texte a bien été sauvegardé.', timeout: '5000'});

    $('#textElementModal').modal('hide');
}