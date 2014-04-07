ReadFileProject = function(fileContent) {
    this.fileContent = fileContent;

    this.nameProject = null;
    this.dateCreation = null;
    this.lastSave = null;

    this.contentElements = null;
    this.contentFiles = null;
    this.contentTextElements = null;
    this.contentTracks = null;

    this.mainParse();
}

ReadFileProject.prototype.mainParse = function() {
    console.log('parse : ' + this.fileContent);

    var parseContent = this.fileContent.match('<project>(.*)</project>')[1];

    console.log('parseContent : ' + parseContent);

    this.nameProject = parseContent.match('<nameProject>(.*)</nameProject>')[1];
    this.dateCreation = parseContent.match('<dateCreation>(.*)</dateCreation>')[1];
    this.lastSave = parseContent.match('<lastSave>(.*)</lastSave>')[1];

    this.contentElements = parseContent.match('<elementsProject>(.*)</elementsProject>')[1];
    this.contentFiles = parseContent.match('<filesProject>(.*)</filesProject>')[1];
    this.contentTextElements = parseContent.match('<textElementsProject>(.*)</textElementsProject>')[1];
    this.contentTracks = parseContent.match('<tracksProject>(.*)</tracksProject>')[1];

    console.log('contentElements : ' + this.contentElements);

    //this.parseTabListElements(contentElements);
    //this.parseTabListFiles(contentFiles);
    //this.parseTabListTextElements(contentTextElements);
    //this.parseTabListTracks(contentTracks);
}

ReadFileProject.prototype.parseTabListElements = function() {
    var tabListElementsN = [];

    var elements = this.contentElements.match('<element>(.*)</element>');

    console.log('elements[1] : ' + elements[1]);

    if(elements.length > 0)
    {
        console.log('yes');

        for(var i = 1; i < elements.length; i++)
        {
            var id = elements[i].match('<id>(.*)</id>')[1];
            var name = elements[i].match('<name>(.*)</name>')[1];
            var initialDuration = elements[i].match('<initialDuration>(.*)</initialDuration>')[1];
            var fileId = elements[i].match('<fileId>(.*)</fileId>')[1];
            var trackId = elements[i].match('<trackId>(.*)</trackId>')[1];

            tabListElementsN[i - 1] = new Elements(id, name, initialDuration, fileId, trackId);
        }
    }

    return tabListElementsN;
}

ReadFileProject.prototype.parseTabListFiles = function() {
    var tabListFilesN = [];

    return tabListFilesN;
}

ReadFileProject.prototype.parseTabListTextElements = function() {
    var tabListTextElementsN = [];

    return tabListTextElementsN;
}



ReadFileProject.prototype.parseTabListTracks = function() {
    var tabListTracksN = [];

    return tabListTracksN;
}