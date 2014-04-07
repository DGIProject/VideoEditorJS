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
}

ReadFileProject.prototype.parseTabListElements = function() {
    var tabListElementsN = [];

    console.log('contentElements : ' + this.contentElements);

    var elements = this.contentElements.match('<element>(.*)</element>');

    console.log('length : ' + elements.length);
    console.log('elements[1] : ' + elements[1]);

    if(elements.length > 0)
    {
        console.log('yes');

        for(var i = 1; i < elements.length; i++)
        {
            console.log(i);

            var id = elements[1].match('<id>(.*)</id>')[1];

            console.log('test1');

            var name = elements[1].match('<name>(.*)</name>');
            var initialDuration = elements[1].match('<initialDuration>(.*)</initialDuration>');
            var fileId = elements[1].match('<fileId>(.*)</fileId>');
            var trackId = elements[1].match('<trackId>(.*)</trackId>');

            console.log('infoElement : ' + id.length + ' - ' + name.length + ' - ' + initialDuration.length);

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