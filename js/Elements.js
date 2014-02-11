/**
 * Created by Guillaume on 11/02/14.
 */

oneSecond = 5; // in px

Elements = function(id, name, initialDuration)
{
    this.id = id
    this.name = name
    this.initialDuration = initialDuration; // in h:m:s
    this.length = this.calculateLenght(); // in px
    this.x = 0;
    this.y = 0;
}
Elements.prototype.setPosition = function(x,y)
{
    this.x = x;
    this.y = y;
}
Elements.prototype.getPosition = function()
{
    return {x:this.x,y:this.y};
}
Elements.prototype.changeLength = function(newLength)
{
    this.length = newLength;
}
Elements.prototype.getDurationInSecondFromLength = function()
{

    return  Math.ceil(this.length / oneSecond);

}
Elements.prototype.getDurationWithFormat = function()
{
    var numberOfSecond = Math.ceil(this.length / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberOfSecond*1000);
    return {h:convertedTime.getHours(),m:convertedTime.getMinutes(),s:convertedTime.getSeconds()};
}
Elements.prototype.getDurationInSecondFromffmpegFormat = function()
{
    var splitedValueFromText = this.initialDuration.split(':')
    var minute = splitedValueFromText[1]
    var seconde = splitedValueFromText[2].split('.')[0]
    var heure = splitedValueFromText[0]
    var totalseconde = (3600*heure)+(60*minute)+parseInt(seconde)
    return totalseconde;
}
Elements.prototype.calculateLenght = function()
{
    return this.getDurationInSecondFromffmpegFormat()*oneSecond
}