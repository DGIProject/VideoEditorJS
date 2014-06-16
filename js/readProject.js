/**
 * Created by Guillaume on 16/06/14.
 */

Loader = function(dataLoaded) {
    this.info = dataLoaded;
}
Loader.prototype.addTrack = function()
{

}
Loader.prototype.addElement = function()
{

}
Loader.prototype.addFile = function(file)
{

    if(tabListFiles.length > 0)
    {
        newId = tabListFiles[tabListFiles.length - 1].id + 1;
    }
    else
    {
        newId = 0;
    }


    var currentItem = new FileList(file.id, file.type, file.size, file.fileName, file.format);
    console.log('currentItem ' + currentItem);
    if (file.type = "image")
    {
        currentItem.setDuration(file.duration)
    }
    tabListFiles.push(currentItem);

    var iconeName = ""
    console.log('typeFile : ' + file.type);
    if (file.type == "text")
        iconeName = "glyphicon-text-width"
    else if (file.type == "audio")
        iconeName = "glyphicon-music"
    else if (file.type == "video")
        iconeName = "glyphicon-film"
    else
        iconeName = "glyphicon-file"
    document.getElementById('listFilesLib').innerHTML += '<a href="#" onclick="fileProperties(' + newId + ', \'' + file.type + '\');" class="list-group-item" id="libFile' + newId + '" idFile="' + newId + '"><h4 id="nameFile' + newId + '" class="list-group-item-heading"><span class="glyphicon '+iconeName+'"></span> ' + compressName(file.fileName) + '</h4><div id="divToolsFile' + newId + '"></div></a>';

}
Loader.prototype.load = function()
{
    currentProject = this.info.project;
    updateTextProject();

    files = this.info.files

    for (i=0;i<files.length;i++)
    {
        this.addFile(files[i]);
    }

    hideLoadingDiv();
}