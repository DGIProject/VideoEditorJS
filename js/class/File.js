var TYPE = {
    AUDIO : 0,
    VIDEO : 1,
    IMAGE : 2,
    TEXT : 3
};

File = function(id, type, size, fileName, format) {
    this.id = id;
    this.type = type;
    this.size = size;
    this.fileName = fileName;
    this.format = format;

    this.isVideo = false;
    this.isAudio = false;

    this.thumbnail = {i: null, a: null};

    this.isSelected = false;

    //upload
    this.isUploaded = false;
    this.uploadFile = 0;
    this.uploadThumbnail = {i: 0, a: 0};
};

File.prototype.makeVideo = function() {
    this.isVideo = true;
};

File.prototype.makeAudio = function() {
    this.isAudio = true;
};

File.prototype.setDuration = function(duration)
{
    this.duration = duration;
};

File.prototype.isEditing = function()
{
    return this.type == TYPE.TEXT;
};

File.prototype.setProperties = function(properties)
{
    this.properties = properties;
};

File.prototype.setThumbnailImage = function(blobImageUrl)
{
    this.thumbnail.i = blobImageUrl;
};

File.prototype.setThumbnailAudio = function(blobImageUrl)
{
    this.thumbnail.a = blobImageUrl;
};

File.prototype.getDurationInSecond = function()
{
    var time = this.duration.split(':');

    return (parseInt(time[0]) * 3600) + (parseInt(time[1] * 60)) + parseInt(time[2].split('.')[0]);
};