/**
 * Created by Guillaume on 11/02/14.
 */

oneSecond = 5; // in px

Elements = function (id, name, initialDuration) {
    this.id = id
    this.name = name
    this.initialDuration = initialDuration; // in h:m:s
    this.currentDuration = initialDuration;
    this.length = this.calculateLenght(); // in px
    this.maxLength = this.calculateMaxLenght();
    this.marginXpx = 0;
    this.marginXDuration = 0;
    this.marginXsecond = 0;

}
Elements.prototype.changeLength = function (newLength) {
    this.length = newLength;
}
Elements.prototype.getDurationInSecondFromLength = function () {

    return  Math.ceil(this.length / oneSecond);

}
Elements.prototype.getDurationWithFormat = function () {
    var numberOfSecond = Math.ceil(this.length / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberOfSecond * 1000);
    return {h: convertedTime.getHours(), m: convertedTime.getMinutes(), s: convertedTime.getSeconds()};
}
Elements.prototype.getDurationInSecondFromffmpegFormat = function () {
    var splitedValueFromText = this.initialDuration.split(':')
    var minute = splitedValueFromText[1]
    var seconde = splitedValueFromText[2].split('.')[0]
    var heure = splitedValueFromText[0]
    var totalseconde = (3600 * heure) + (60 * minute) + parseInt(seconde)
    return totalseconde;
}
Elements.prototype.getDurationInSecondFromCurrentDuration = function () {
    var splitedValueFromText = this.currentDuration.split(':')
    var minute = splitedValueFromText[1]
    var seconde = splitedValueFromText[2].split('.')[0]
    var heure = splitedValueFromText[0]
    var totalseconde = (3600 * heure) + (60 * minute) + parseInt(seconde)
    return totalseconde;
}
Elements.prototype.calculateLenght = function () {
    return this.getDurationInSecondFromCurrentDuration() * oneSecond
}
Elements.prototype.actualiseLenght = function () {
    this.length = this.calculateLenght()
    this.maxLength = this.calculateMaxLenght()
    this.calculateMarginX()
}
Elements.prototype.calculateMaxLenght = function () {
    return this.getDurationInSecondFromffmpegFormat() * oneSecond
}
Elements.prototype.resize = function(newLenth){
    var numberSecond = Math.floor(newLenth / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberSecond * 1000);
   var timeStr = convertedTime.getHours()-1+':'+convertedTime.getMinutes()+':'+convertedTime.getSeconds();
    this.currentDuration = timeStr;
    console.log(timeStr);
    this.length = this.calculateLenght();
}
Elements.prototype.setMarginX = function (marginPx){
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