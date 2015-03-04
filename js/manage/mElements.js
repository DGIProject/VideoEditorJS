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

    var color = randomColor();

    file.thumbnail.a = file.thumbnail.i;

    if(file.isVideo && file.isAudio)
    {
        elementTrack(track, id1, ((track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), color, {total: timeToSeconds(file.duration), begin: timeBegin}, id, trackId, marginLeft, id2);
        elementTrack(parentTrack, id2, ((parentTrack.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), color, {total: timeToSeconds(file.duration), begin: timeBegin}, id, track.parent, marginLeft, id1);
    }
    else
    {
        elementTrack(track, id1, ((track.type == TYPE.VIDEO) ? file.thumbnail.i : file.thumbnail.a), color, {total: timeToSeconds(file.duration), begin: timeBegin}, id, trackId, marginLeft, false);
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

function elementTrack(track, elementId, thumbnailData, color, time, fileId, trackId, marginLeft, parent) {
    var imageThumbnail = new Image();

    imageThumbnail.onload = function() {
        track.tabElements.push(new Element(elementId, imageThumbnail, color, time, fileId, trackId, marginLeft, parent));

        drawElements(trackId);
    };

    imageThumbnail.src = thumbnailData;
}

function breakLinkElements(id, trackId) {
    var track = currentProject.tabListTracks[rowById(trackId, currentProject.tabListTracks)];
    var element = track.tabElements[rowById(id, track.tabElements)];

    if(element.parent >= 0)
    {
        var parentElement = track.tabElements[rowById(track.parent, track.tabElements)];
        parentElement.parent = false;
        parentElement.color = randomColor();

        element.parent = false;
    }

    drawElementsTracks();
}

function deleteElement(rowTrack, rowElement) {
    var track = currentProject.tabListTracks[rowTrack];

    if(track.tabElements[rowElement].parent >= 0)
    {
        track.tabElements.remove(rowById(track.tabElements[rowElement].parent, track.tabElements));
    }

    track.tabElements.remove(rowElement);
}