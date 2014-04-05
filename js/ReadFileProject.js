ReadFileProject = function(fileContent) {
    this.fileContent = fileContent;

    this.mainParse();
}

ReadFileProject.prototype.mainParse = function() {
    var contentElements, contentFiles, contentTextElements, contentTracks;

    this.parseTabListElements(contentElements);
    this.parseTabListFiles(contentFiles);
    this.parseTabListTextElements(contentTextElements);
    this.parseTabListTracks(contentTracks);
}

ReadFileProject.prototype.parseTabListElements = function(contentElements) {
    var tabListElementsN = [];

    return tabListElementsN;
}

ReadFileProject.prototype.parseTabListFiles = function(contentFiles) {
    var tabListFilesN = [];

    return tabListFilesN;
}

ReadFileProject.prototype.parseTabListTextElements = function(contentTextElements) {
    var tabListTextElementsN = [];

    return tabListTextElementsN;
}



ReadFileProject.prototype.parseTabListTracks = function(contentTracks) {
    var tabListTracksN = [];

    return tabListTracksN;
}