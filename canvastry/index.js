var c = document.getElementById('canvas');
var ctx = c.getContext("2d");

ctx.width = 500;
ctx.height = 100;

ctx.fillStyle = '#E0E0E0';
ctx.fillRect(0, 0, ctx.width, ctx.height);

var imageThumbnail = new Image();

imageThumbnail.onload = function() {
    console.log('loaded thumbnail');
};

imageThumbnail.src = 'http://clangue.net/other/testVideo/canvastry/img/thumbnail.png';

var imageClose = new Image();

imageClose.onload = function() {
    console.log('loaded close');
};

imageClose.src = 'http://clangue.net/other/testVideo/canvastry/img/close.png';

var mousedown = false;
var gap = 0;

var scroll = 0;

var tabElement = [];
var currentRow = 0;

c.onclick = function(e) {
    /*
    console.log('click');
    
    var x = e.offsetX==undefined?e.layerX:e.offsetX;
    var y = e.offsetY==undefined?e.layerY:e.offsetY;
    
    console.log(x, y);
    
    rowTabElement(x);
    drawElements();
    */
};

c.onmousedown = function(e) {
    console.log('mousedown');

    mousedown = true;

    var x = e.offsetX==undefined?e.layerX:e.offsetX;
    var y = e.offsetY==undefined?e.layerY:e.offsetY;

    console.log(x, y);

    rowTabElement(x);
    drawElements();
};

c.onmouseup = function(e) {
    mousedown = false;

    for(var i = 0; i < tabElement.length; i++)
    {
        if(tabElement[currentRow].marginLeft > tabElement[i].marginLeft && tabElement[currentRow].marginLeft < (tabElement[i].marginLeft + tabElement[i].width))
        {
            console.log('collision before');

            tabElement[i].width = tabElement[currentRow].marginLeft - tabElement[i].marginLeft;
        }

        if((tabElement[currentRow].marginLeft + tabElement[currentRow].width) > tabElement[i].marginLeft && (tabElement[currentRow].marginLeft + tabElement[currentRow].width) < (tabElement[i].marginLeft + tabElement[i].width))
        {
            console.log('collision after');

            console.log((tabElement[i].marginLeft + tabElement[i].width) - (tabElement[currentRow].marginLeft + tabElement[currentRow].width));

            tabElement[i].marginLeft = (tabElement[i].marginLeft + tabElement[i].width) - ((tabElement[i].marginLeft + tabElement[i].width) - (tabElement[currentRow].marginLeft + tabElement[currentRow].width));
            tabElement[i].width = (tabElement[i].marginLeft + tabElement[i].width) - (tabElement[currentRow].marginLeft + tabElement[currentRow].width);
        }
    }

    drawElements();
};

c.onmousemove = function(e) {
    var x = e.offsetX==undefined?e.layerX:e.offsetX;

    if(mousedown && currentRow != 'none')
    {
        tabElement[currentRow].marginLeft = x - gap;

        drawElements();
    }
};

/*
document.getElementById('divCanvas').onscroll = function() {
    console.log(this.scrollLeft);

    c.style.width = (ctx.width + 5) + 'px';
    c.style.height = '100px';

    ctx.width = ctx.width + 2;
    ctx.height = 100;
};
*/

function plusScroll() {
    scroll += 2;
    drawElements();
}

function lessScroll() {
    if(scroll >= 2)
    {
        scroll -= 2;
        drawElements();
    }
}

function rowTabElement(x) {
    currentRow = 'none';

    for(var i = 0; i < tabElement.length; i++)
    {
        if(tabElement[i].marginLeft <= x && (tabElement[i].marginLeft + tabElement[i].width) >= x)
        {
            console.log('row : ', i);

            currentRow = i;
            gap = x - tabElement[i].marginLeft;

            tabElement[i].selected = true;
        }
        else
        {
            tabElement[i].selected = false;
        }
    }
}

function addElement() {
    var width = 100;
    var marginLeft = 0;

    for(var i = 0; i < tabElement.length; i++)
    {
        marginLeft += tabElement[i].width;
        tabElement[i].selected = false;
    }
    
    tabElement.push(new Element(tabElement.length, width, marginLeft));

    drawElements();
}

function drawElements() {
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, ctx.width, ctx.height);

    for(var i = 0; i < tabElement.length; i++)
    {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = (tabElement[i].selected) ? 'blue' : 'gray';
        ctx.fillStyle = '#66CCFF';
        ctx.rect(tabElement[i].marginLeft - scroll, 0, tabElement[i].width, 100);
        ctx.stroke();

        ctx.font = '15px Calibri';
        ctx.fillStyle = '#000000';
        ctx.fillText('Test', (tabElement[i].marginLeft + 10) - scroll, 15);

        ctx.drawImage(imageClose, (tabElement[i].marginLeft + tabElement[i].width - 20) - scroll, 5, 15, 15);

        var showWidth = imageThumbnail.width - (((80 - (tabElement[i].width - 20)) / 80) * imageThumbnail.width);

        console.log(showWidth, (80 - (tabElement[i].width - 20)), (((80 - (tabElement[i].width - 20)) / 80) * imageThumbnail.width), imageThumbnail.width);

        ctx.drawImage(imageThumbnail, 0, 0, showWidth, imageThumbnail.height, (tabElement[i].marginLeft + 10) - scroll, 35, (80 - (80 - (tabElement[i].width - 20))), 80 * (imageThumbnail.height / imageThumbnail.width));
    }
}