window.onload = function (e) {
    calculateTimeBar();
};

window.onbeforeunload = function (e) {
    e = e || window.event;

    if(currentProject) {
        saveProject();
    }

    var msg = 'Voulez-vous quitter ? Des fichiers sont peut-être toujours en envoi vers le serveur.';

    if (e) {
        e.returnValue = msg;
    }

    return msg;
};

window.onclick = function() {
    if(currentProject) {
        hideContextMenu();
    }
};

window.onmouseup = function() {
    if(currentProject) {
        mouseUp();
    }
};

document.getElementById('audioView').onscroll = function() {
    //console.log(this.scrollLeft);

    document.getElementById('videoView').scrollLeft = this.scrollLeft;

    if(this.scrollLeft > scrollTracks)
    {
        scrollPlusTracks();
    }
    else
    {
        scrollLessTracks();
    }

    pixelTimeBar.g = this.scrollLeft;
    pixelTimeBar.d = 710 + this.scrollLeft;

    calculateTimeBar();
    drawElementsTracks();
};

document.getElementById('listFiles').ondragover = function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
};

document.getElementById('listFiles').ondrop = function(e) {
    console.log('dropFile');

    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    addFile(files[0]);

    console.log(files[0]);

    /*
    var myFileReader = new FileReader();
    var myFile = e.dataTransfer.files[0];

    console.log(myFileReader.readAsDataURL(myFile));
    */
};