/**
 * Created by Dylan on 10/02/2015.
 */

function addElement(id, idTrack, posX) {
    var info = currentProject.tabListFiles[id];

    console.log(info);

    var idElement = (currentProject.tabListTracks[idTrack].tabElements.length > 0) ? currentProject.tabListTracks[idTrack].tabElements[currentProject.tabListTracks[idTrack].tabElements.length-1].id + 1 : 0;

    var marginLeft = 0;

    if(posX != undefined)
    {
        marginLeft = posX;
    }
    else
    {
        for(var i = 0; i < currentProject.tabListTracks.length; i++)
        {
            for(var x = 0; x < currentProject.tabListTracks[i].tabElements.length; x++)
            {
                marginLeft = ((currentProject.tabListTracks[i].tabElements[x].marginLeft + currentProject.tabListTracks[i].tabElements[x].width) > marginLeft) ? (currentProject.tabListTracks[i].tabElements[x].marginLeft + currentProject.tabListTracks[i].tabElements[x].width) : marginLeft;
            }
        }
    }

    currentProject.tabListTracks[idTrack].tabElements.push(new Element(idElement, info.duration, id, idTrack, marginLeft, false));

    drawElements(idTrack);
}