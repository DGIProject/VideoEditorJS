/**
 * Created by Dylan on 11/03/2015.
 */

ReadFileProject = function(fileContent) {
    this.tabProject = JSON.parse(fileContent);

    this.infoProject = this.tabProject.project;
    this.listFiles = this.tabProject.files;
    this.listTracks = this.tabProject.tracks;
};

ReadFileProject.prototype.setListFiles = function() {
    for(var i = 0; i < this.listFiles.length; i++)
    {
        var file = this.listFiles[i];

        currentProject.tabListFiles.push(new File(file.id, file.type, file.size, file.fileName, file.format));

        addFileList(file.id, file.fileName, file.type);
    }
};