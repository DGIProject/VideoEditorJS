'use strict';

// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
    var options = {
        container     : document.querySelector('#waveform'),
        waveColor     : 'violet',
        progressColor : 'violet'
    };

    // Init
    wavesurfer.init(options);
    // Load audio from URL
    wavesurfer.load('example/media/demo.wav');
});

// Play at once when ready
// Won't work on iOS until you touch the page
wavesurfer.on('ready', function () {
    //wavesurfer.play();

    var canvas = findFirstDescendant("waveform", "canvas");
    canvas.toBlob(function(blob) {
        var newImg = document.createElement("img"),
            url = URL.createObjectURL(blob);

        newImg.onload = function() {
            // no longer need to read the blob so it's revoked
            URL.revokeObjectURL(url);
            document.getElementById('waveform').style.display = "none";
        };

        newImg.src = url;
        document.body.appendChild(newImg);
    }, "image/png");
});

function findFirstDescendant(parent, tagname)
{
    parent = document.getElementById(parent);
    var descendants = parent.getElementsByTagName(tagname);
    if ( descendants.length )
        return descendants[0];
    return null;
}
// Report errors
wavesurfer.on('error', function (err) {
    console.error(err);
});