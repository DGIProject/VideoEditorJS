var TYPE = {
    AUDIO : 0,
    VIDEO : 1,
    IMAGE : 2,
    TEXT : 3
};

File = function(id, type, size, fileName, compressName, format) {
    this.id = id;
    this.type = type;
    this.size = size;
    this.fileName = fileName;
    this.compressName = compressName;
    this.format = format;

    this.thumbnail = {i: null, a: null};

    this.isUploaded = false;
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