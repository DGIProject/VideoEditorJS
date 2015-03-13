document.onclick = function() {
    if(currentProject) {
        hideContextMenu();
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

    e.preventDefault();

    var files = e.dataTransfer.files,
        filesLen = files.length,
        filenames = "";

    for(var i = 0 ; i < filesLen ; i++) {
        filenames += '\n' + files[i].name;
    }

    console.log(files.length + ' fichier(s) :\n' + filenames);

    var myFileReader = new FileReader();
    //var myFile = e.dataTransfer.files[0];

    console.log(/*myFileReader.readAsDataURL(myFile),*/ e.dataTransfer.types);
};

document.getElementById('listFiles').ondrop = function(e) {
    console.log('dropFile');

    var myFileReader = new FileReader();
    var myFile = e.dataTransfer.files[0];

    console.log(myFileReader.readAsDataURL(myFile));
};