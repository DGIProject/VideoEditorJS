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
    var row = rowById(id, currentProject.tabListFiles);

    currentManageTextElement.editTextElement(id, currentProject.tabListFiles[row].properties);

    $('#textElementModal').modal('show');
}

function saveTextElement() {
    var textElement = currentManageTextElement.getInformationsTextElement();

    if(currentManageTextElement.isEditing)
    {
        var row = rowById(currentManageTextElement.file.id, currentProject.tabListFiles);
        var file = currentProject.tabListFiles[rowById(currentManageTextElement.file.id, currentProject.tabListFiles)];

        document.getElementById('textElement').toBlob(function(blob) {
            file.size = blob.size;
            file.properties.updateValuesElement(textElement.nameText, textElement.text, textElement.font, textElement.sizeText, textElement.color, textElement.textAlign, textElement.posElement);
            file.setThumbnailImage(window.URL.createObjectURL(blob));

            uploadFile(currentManageTextElement.file.id, row, blob, 'FILE');
        }, 'image/png');
    }
    else
    {
        var fileId = (currentProject.tabListFiles.length > 0) ? (currentProject.tabListFiles[currentProject.tabListFiles.length - 1].id + 1) : 0;

        var currentItem = new File(fileId, TYPE.TEXT, 0, textElement.nameText, 'png');
        currentItem.makeVideo();
        currentItem.setDuration('00:00:20');

        document.getElementById('textElement').toBlob(function(blob) {
            currentItem.size = blob.size;
            currentItem.setProperties(new TextElement(textElement.id, textElement.nameText, textElement.text, textElement.font, textElement.sizeText, textElement.color, textElement.textAlign, textElement.posElement));
            currentItem.setThumbnailImage(window.URL.createObjectURL(blob));

            console.log('currentItem ' + currentItem);
            currentProject.tabListFiles.push(currentItem);

            addFileList(fileId, textElement.nameText, TYPE.TEXT);
            uploadFile(fileId, (currentProject.tabListFiles.length - 1), blob, 'FILE');
        }, 'image/png');
    }

    var n = noty({layout: 'topRight', type: 'success', text: 'Le texte a bien été sauvegardé.', timeout: '5000'});

    $('#textElementModal').modal('hide');
}