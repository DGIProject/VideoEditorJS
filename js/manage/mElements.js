/**
 * Created by Dylan on 10/02/2015.
 */

function addElement(id, trackId, posX, timeBegin) {
    var file = currentProject.tabListFiles[rowById(id, currentProject.tabListFiles)];

    var track = currentProject.tabListTracks[rowById(trackId, currentProject.tabListTracks)];
    var parentTrack = currentProject.tabListTracks[rowById(track.parent, currentProject.tabListTracks)];

    console.log(file);

    var id1 = (track.tabElements.length > 0) ? track.tabElements[track.tabElements.length - 1].id + 1 : 0;
    var id2 = id1 + 1;

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

    file.thumbnail.a = file.thumbnail.i;

    if(file.isVideo && file.isAudio)
    {
        elementTrack(track, id1, ((track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), {total: timeToSeconds(file.duration), begin: timeBegin}, id, trackId, id2);
        elementTrack(parentTrack, id2, ((parentTrack.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), {total: timeToSeconds(file.duration), begin: timeBegin}, id, track.parent, id1);
    }
    else
    {
        elementTrack(track, id1, ((track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), {total: timeToSeconds(file.duration), begin: timeBegin}, id, trackId, false);
    }

    /*
    if(track.type == TYPE.VIDEO)
    {
        var imageThumbnail = new Image();

        imageThumbnail.onload = function() {
            track.tabElements.push(new Element(idElement, imageThumbnail, {total: timeToSeconds(file.duration), begin: timeBegin}, id, idTrack, marginLeft, false));

            drawElements(idTrack);
        };

        imageThumbnail.src = (track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a;
    }
    */
}

function elementTrack(track, elementId, thumbnailData, time, fileId, trackId, marginLeft, parent) {
    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        track.tabElements.push(new Element(elementId, imageThumbnail, time, fileId, trackId, marginLeft, parent));

        drawElements(trackId);
    };

    imageThumbnail.src = thumbnailData;
}

function deleteElement(rowTrack, rowElement) {
    currentProject.tabListTracks[rowTrack].tabElements.remove(rowElement);
}