/**
 * Created by Dylan on 10/02/2015.
 */

function addElement(id, idTrack, posX) {
    var file = currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)];
    var track = currentProject.tabListTracks[rowById(idTrack, currentProject.tabListTracks)];

    console.log(file);

    var idElement = (track.tabElements.length > 0) ? track.tabElements[track.tabElements.length - 1].id + 1 : 0;

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

    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        track.tabElements.push(new Element(idElement, imageThumbnail, {total: file.duration, begin: 0}, id, idTrack, marginLeft, false));

        drawElements(idTrack);
    };

    imageThumbnail.src = (track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a;
}

function deleteElement(rowTrack, rowElement) {
    currentProject.tabListTracks[rowTrack].tabElements.remove(rowElement);
}