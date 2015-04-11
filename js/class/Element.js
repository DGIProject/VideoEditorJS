Element = function(id, type, thumbnail, color, duration, fileId, trackId, marginLeft, properties) {
    this.id = id;

    this.fileId = fileId;
    this.trackId = trackId;

    this.type = type;

    this.thumbnail = thumbnail;
    this.color = color;

    this.properties = properties;

    this.totalDuration = duration.total;
    this.beginDuration = duration.begin;
    this.currentDuration = this.totalDuration - this.beginDuration;

    this.width = this.calculateWidth();
    this.minWidth = 5;
    this.maxWidth = this.width;

    this.marginLeft = marginLeft;

    this.leftGap = 0;
    this.rightGap = 0;

    this.parent = -1;

    this.selected = true;
};

Element.prototype.calculateWidth = function() {
    return this.currentDuration * oneSecond;
};

Element.prototype.setParent = function(parent) {
    this.parent = parent;
};