/**
 * Created by Guillaume on 29/01/14.
 */

var numberOfTrack = 0;

function addTrack()
{
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById("VideoView");
    var newTrack = document.createElement('div');
    var newViewTrack = document.createElement('div');
    numberOfTrack++;
    newTrack.setAttribute("class","singleTrack");
    newTrack.setAttribute("id","track"+numberOfTrack);
    newTrack.innerHTML = "<div class='optionsTrack'><a href='#' onclick='deleteTrack("+numberOfTrack+")'><img src='img/close.png' alt=''/></a><a href='#'><img src='img/param.png' alt=''/></a></div>"
    tracks.appendChild(newTrack);

    newViewTrack.setAttribute("class","singleTrack");
    newViewTrack.setAttribute("id","ViewTrack"+numberOfTrack);
    videoView.appendChild(newViewTrack);
}

function deleteTrack(id)
{
    var tracks = document.getElementById('tracks');
    var videoView = document.getElementById("VideoView");
    var trackToDelete = document.getElementById("track"+id);
    var ViewTrackToDelete = document.getElementById("ViewTrack"+id);
    videoView.removeChild(ViewTrackToDelete);
    tracks.removeChild(trackToDelete);
}

function New()
{
    numberOfTrack = 0;
    var tracks = document.getElementById('tracks');
    tracks.innerHTML ="";
    var videoView = document.getElementById("VideoView");
    videoView.innerHTML = "";
}

function scroolAllTracks()
{
    var tracks = document.getElementById("tracks"), videoTrackView = document.getElementById("VideoView");
    var positionActuelle = videoTrackView.scrollTop;
    console.log(positionActuelle);
    tracks.scrollTop = positionActuelle;
    videoTrackView.scrollTop = positionActuelle;
}

function generateTimetick()
{
    var timediv = document.getElementById('time');

}

function addFileTrack(id)
{
    console.log('addFileTrack');
}

function settingsTrack(id)
{
    console.log('deleteTrack');
}

function updateNameTrack(id, nameTrack)
{
    console.log(nameTrack);
}