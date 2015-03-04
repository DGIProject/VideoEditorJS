FileUpload = function(id, fileId, name, type) {
    this.id = id;
    this.fileId = fileId;

    this.name = name;
    this.type = type;

    this.progress = 0; //in %
};

FileUpload.prototype.setProgress = function(progress) {
    this.progress = progress;
};