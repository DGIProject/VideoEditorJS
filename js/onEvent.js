document.onclick = function() {
    if(currentProject) {
        hideContextMenu();
    }
};

document.getElementById('audioView').onscroll = function() {
    console.log(this.scrollLeft);

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