Element = function(id, thumbnail, duration, fileId, trackId, marginLeft, parent) {
    this.id = id;

    this.fileId = fileId;
    this.trackId = trackId;

    this.thumbnail = thumbnail;

    this.totalDuration = this.timeToSecond(duration.total);
    this.beginDuration = duration.begin;
    this.currentDuration = this.totalDuration;

    this.width = this.calculateWidth();
    this.minWidth = 20;
    this.maxWidth = this.width;

    this.marginLeft = marginLeft;

    this.leftGap = 0;
    this.rightGap = 0;

    this.parent = parent;

    this.selected = true;
};

Element.prototype.timeToSecond = function(initialDuration) {
    var time = initialDuration.split(':');

    return (parseInt(time[0]) * 3600) + (parseInt(time[1] * 60)) + parseInt(time[2].split('.')[0]);
};

Element.prototype.calculateWidth = function() {
    return this.totalDuration * oneSecond;
};