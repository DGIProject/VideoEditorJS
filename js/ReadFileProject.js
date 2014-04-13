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

    console.log('contentElements1 : ' + this.contentElements);
}

ReadFileProject.prototype.parseTabListElements = function() {
    var tabListElementsN = [];

    console.log('contentElements2 : ' + this.contentElements);

    var elements = this.contentElements.match('<element>(.*)</element>');

    console.log('length : ' + elements.length);

    if(elements.length > 0)
    {
        console.log('yes');

        for(var i = 1; i < elements.length; i++)
        {
            console.log(i);
            console.log('elements[' + i + '] : ' + elements[i]);

            var id = elements[1].match('<idE>(.*)</idE>');

            console.log('test1');

            //var name = elements[1].match('<nameE>(.*)</nameE>')[1];
            //var initialDuration = elements[1].match('<initialDurationE>(.*)</initialDurationE>')[1];
            //var fileId = elements[1].match('<fileIdE>(.*)</fileIdE>')[1];
            //var trackId = elements[1].match('<trackIdE>(.*)</trackIdE>')[1];

            console.log('infoElement : ' + id.length);

            //tabListElementsN[i - 1] = new Elements(id, null, null, null, null);
        }
    }
    else
    {
        console.log('noElements');
    }

    //return tabListElementsN;
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