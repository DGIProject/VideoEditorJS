FileList = function(id, type, size, fileName, format) {
    this.id = id;
    this.type = type;
    this.size = size;
    this.fileName = fileName;
    this.format = format;
}

FileList.prototype.setDuration = function(duration)
{
    this.duration = duration;
}
