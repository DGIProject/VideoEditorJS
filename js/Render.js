/**
 * Created by Guillaume on 18/02/14.
 */

Render = function(tabListElements,tabListFiles,tabListTextElements, tabListTracks)
{
    this.onProcessEnd ;
    this.Elements = tabListElements
    this.Files = tabListFiles;
    this.TextElements = tabListTextElements;
    this.Tracks = tabListTracks;
    this.videoLenthPx = 0; //PX !!!
    this.videoDuration = 0 //Secondes !!
    this.prepareElement();

}
Render.prototype.prepareElement = function()
{
    var ElementIncrementMin = 100000000;
    var ElementIncrementMinId;
    for (i = 0 ;i<this.Elements.length;i++)
    {
        if (this.Elements[i].marginXpx < ElementIncrementMin)
        {
            ElementIncrementMinId = i;
            ElementIncrementMin = this.Elements[i].marginXpx
        }
    }
    console.log(ElementIncrementMin,ElementIncrementMinId);
    // traitement de tout les element de piste pour connaitre la durée maximale de la Video .
    var ElementEnd;
    for (i = 0 ;i<this.Elements.length;i++)
    {
        ElementEnd = this.Elements[i].marginXpx + this.Elements[i].length
        if(ElementEnd > this.videoLenthPx)
        {
            this.videoLenthPx = ElementEnd + 50
        }
    }

    //At this moment we have the lenth in px of the video so to have de duration we need to convert it ....

    var numberSecond = Math.floor(this.videoLenthPx / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberSecond * 1000);
    var timeStr = convertedTime.getHours()-1+':'+convertedTime.getMinutes()+':'+convertedTime.getSeconds();
    this.videoDuration = timeStr;

    //So we have the duration of the student video

    //TODO: create method to convert all file elements.

    //
    //
    console.log(this.makeRenderCommandList())
    this.onProcessEnd(['ok']);

    console.log(this)

}
Render.prototype.makeRenderCommandList = function()
{
    var listCommand = [];

    for (i=0;i<this.Elements.length;i++)
    {
        var tempCommand = "-i fileInput -ss "+ this.Elements[i].getStartTimeFromStartLenth() +"-t "+this.Elements[i].getDurationInSecondFromCurrentDuration() - this.Elements[i].startTime +" "+this.Elements[i].name+".mp4"
        listCommand.push(tempCommand);
    }

    return listCommand;
}