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

    this.isUploaded = false;
};

FileList.prototype.setDuration = function(duration)
{
    this.duration = duration;
};

FileList.prototype.isEditing = function()
{
    return this.type == TYPE.TEXT;
};

FileList.prototype.setProperties = function(properties)
{
    this.properties = properties;
};