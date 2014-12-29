var TYPE = {
    AUDIO : 0,
    VIDEO : 1,
    IMAGE : 2,
    TEXT : 3
};

FileList = function(id, type, size, fileName, compressName, format) {
    this.id = id;
    this.type = type;
    this.size = size;
    this.fileName = fileName;
    this.compressName = compressName;
    this.format = format;

    this.thumbnailImage = null;

    this.isUploaded = false;
};

FileList.prototype.setDuration = function(duration)
{
    this.duration = duration;
    this.durationInSecond = this.getDurationInSecondFromDuration();
};

FileList.prototype.isEditing = function()
{
    return this.type == TYPE.TEXT;
};

FileList.prototype.setProperties = function(properties)
{
    this.properties = properties;
};

FileList.prototype.setThumbnailImage = function(blobImageUrl)
{
    this.thumbnailImage = blobImageUrl;

    // TODO : Make a function that send the thumbnail, to allow futur utilisation when loading an old Project.
};

FileList.prototype.getDurationInSecondFromDuration = function()
{
    var splitedValueFromText = this.duration.split(':')
    var minute = splitedValueFromText[1]
    var seconde = splitedValueFromText[2].split('.')[0]
    var heure = splitedValueFromText[0]
    var totalseconde = (3600 * heure) + (60 * minute) + parseInt(seconde)
    return totalseconde;
};