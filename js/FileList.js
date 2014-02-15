FileList = function(id, type, size, fileName, format, data) {
    this.id = id;
    this.type = type;
    this.size = size;
    this.fileName = fileName;
    this.format = format;
    this.data = data;
}

FileList.prototype.setDuration = function(duration)
{
    this.duration = duration;
}

FileList.prototype.setData = function(data)
{
    this.data = data;
}