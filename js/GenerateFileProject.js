GenerateFileProject = function(nameProject, dateCreation, lastSave, tabListElements, tabListFiles, tabListTextElements, tabListTracks) {
    this.nameProject = nameProject;
    this.dateCreation = dateCreation;
    this.lastSave = lastSave;

    this.tabListElements = tabListElements;
    this.tabListFiles = tabListFiles;
    this.tabListTextElements = tabListTextElements;
    this.tabListTracks = tabListTracks;

    this.generateMain();
}

GenerateFileProject.prototype.generateMain = function() {
    var contentMain = '';
    var contentElements = this.generateElements();
    var contentFiles = this.generateFiles();
    var contentTextElements = this.generateTextElements();
    var contentTracks = this.generateTracks();

    contentMain += '<project>' +
        '<nameProject>' + this.nameProject + '</nameProject>' +
        '<dateCreation>' + this.dateCreation + '</dateCreation>' +
        '<lastSave>' + this.lastSave + '</lastSave>' +
        contentElements +
        contentFiles +
        contentTextElements +
        contentTracks +
        '</project>';

    console.log('contentMain : ' + contentMain);

    return contentMain;
}

GenerateFileProject.prototype.generateElements = function() {
    var contentElements = '<elementsProject>';

    for(var i = 0; i < this.tabListElements.length; i++)
    {
        contentElements += '<element>' +
            '<id>' + this.tabListElements[i].id + '</id>' +
            '<name>' + this.tabListElements[i].name + '</name>' +
            '<initialDuration>' + this.tabListElements[i].initialDuration + '</initialDuration>' +
            '<currentDuration>' + this.tabListElements[i].currentDuration + '</currentDuration>' +
            '<length>' + this.tabListElements[i].length + '</length>' +
            '</element>';
    }

    contentElements += '</elementsProject>';

    console.log('contentElements : ' + contentElements);

    return contentElements;
}

GenerateFileProject.prototype.generateFiles = function() {
    var contentFiles = '<filesProject>';

    for(var i = 0; i < this.tabListFiles.length; i++)
    {
        contentFiles += '<file>' +
            '<id>' + this.tabListFiles[i].id + '</id>' +
            '<type>' + this.tabListFiles[i].type + '</type>' +
            '<size>' + this.tabListFiles[i].size + '</size>' +
            '<fileName>' + this.tabListFiles[i].fileName + '</fileName>' +
            '<format>' + this.tabListFiles[i].format + '</format>' +
            '<data>' + this.tabListFiles[i].data + '</data>' +
            '</file>';
    }

    contentFiles += '</filesProject>';

    console.log('contentFiles : ' + contentFiles);

    return contentFiles;
}

GenerateFileProject.prototype.generateTextElements = function() {
    var contentTextElements = '<textElementsProject>';

    for(var i = 0; i < this.tabListTextElements.length; i++)
    {
        contentTextElements += '<textElements>' +
            '<id>' + this.tabListTextElements[i].id + '</id>' +
            '<nameText>' + this.tabListTextElements[i].nameText + '</nameText>' +
            '<contentText>' + this.tabListTextElements[i].contentText + '</contentText>' +
            '<colorText>' + this.tabListTextElements[i].colorText + '</colorText>' +
            '<sizeText>' + this.tabListTextElements[i].sizeText + '</sizeText>' +
            '<posText>' + this.tabListTextElements[i].posText + '</posText>' +
            '</textElements>';
    }

    contentTextElements += '</textElementsProject>';

    console.log('contentTextElements : ' + contentTextElements);

    return contentTextElements;
}

GenerateFileProject.prototype.generateTracks = function() {
    var contentTracks = '<tracksProject>';

    for(var i = 0; i < this.tabListTracks.length; i++)
    {
        contentTracks += '<track>' +
            '<id>' + this.tabListTracks[i].id + '</id>' +
            '<name>' + this.tabListTracks[i].name + '</name>' +
            '<volume>' + this.tabListTracks[i].volume + '</volume>' +
            '<elementsId>' + this.tabListTracks[i].elementsId + '</elementsId>' +
            '<data>' + this.tabListTracks[i].data + '</data>' +
            '</track>';
    }

    contentTracks += '</tracksProject>';

    console.log('contentTracks : ' + contentTracks);

    return contentTracks;
}