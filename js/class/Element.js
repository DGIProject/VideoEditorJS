Element = function(id, initialDuration, fileId, trackId, marginLeft, parent) {
    this.id = id;

    this.fileId = fileId;
    this.trackId = trackId;

    this.totalDuration = this.timeToSecond(initialDuration); // in h:m:s
    this.currentDuration = this.totalDuration;

    this.width = this.calculateWidth();
    this.minWidth = 20;
    this.maxWidth = this.width;

    this.marginLeft = marginLeft;

    this.parent = parent;

    this.selected = true;

    /*
    this.length = this.calculateLenght(); // in px
    this.maxLength = this.calculateMaxLenght();
    this.marginXpx = 0;
    this.marginXDuration = 0;
    this.marginXsecond = 0;
    this.startTime = "0"; //in second
    this.startTimePx = 0;
    this.offset = null;
    */
};

Element.prototype.timeToSecond = function(initialDuration) {
    var time = initialDuration.split(':');

    return (parseInt(time[0]) * 3600) + (parseInt(time[1] * 60)) + parseInt(time[2].split('.')[0]);
};

Element.prototype.calculateWidth = function() {
    return this.totalDuration * oneSecond;
};

/*
Elements.prototype.getDurationWithFormat = function() {
    var numberOfSecond = Math.ceil(this.length / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberOfSecond * 1000);
    return {h: convertedTime.getHours(), m: convertedTime.getMinutes(), s: convertedTime.getSeconds()};
}
Elements.prototype.getDurationInSecondFromffmpegFormat = function() {
    var splitedValueFromText = this.initialDuration.split(':')
    var minute = splitedValueFromText[1]
    var seconde = splitedValueFromText[2].split('.')[0]
    var heure = splitedValueFromText[0]
    var totalseconde = (3600 * heure) + (60 * minute) + parseInt(seconde)
    return totalseconde;
}
Elements.prototype.getDurationInSecondFromCurrentDuration = function() {
    var splitedValueFromText = this.currentDuration.split(':')
    var minute = splitedValueFromText[1]
    var seconde = splitedValueFromText[2].split('.')[0]
    var heure = splitedValueFromText[0]
    var totalseconde = (3600 * heure) + (60 * minute) + parseInt(seconde)
    return totalseconde;
}
Elements.prototype.getStartTimeFromStartLenth = function()
{
    return  Math.ceil(this.startTimePx / oneSecond);
}
Elements.prototype.calculateLenght = function() {
    return this.getDurationInSecondFromCurrentDuration() * oneSecond
}
Elements.prototype.actualiseLenght = function() {
    this.length = this.calculateLenght()
    this.maxLength = this.calculateMaxLenght()
    this.calculateMarginX()
}
Elements.prototype.calculateMaxLenght = function() {
    return this.getDurationInSecondFromffmpegFormat() * oneSecond
}
Elements.prototype.resize = function(newLenth, offset){
    var numberSecond = Math.floor(newLenth / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberSecond * 1000);
   var timeStr = convertedTime.getHours()-1+':'+convertedTime.getMinutes()+':'+convertedTime.getSeconds();
    this.currentDuration = timeStr;
    console.log(timeStr);
    this.length = this.calculateLenght();
    this.offset = offset;
    console.log('offset = '+this.offset);
}
Elements.prototype.setMarginX = function(marginPx){
    this.marginXpx = marginPx;

    var numberSecond = Math.floor(marginPx / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberSecond * 1000);
    var timeStr = convertedTime.getHours()-1+':'+convertedTime.getMinutes()+':'+convertedTime.getSeconds();
    this.marginXDuration = timeStr;
    this.marginXsecond = numberSecond;

}
Elements.prototype.calculateMarginX = function(){
    this.marginXpx = this.marginXsecond * oneSecond;
}
*/