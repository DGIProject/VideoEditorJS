var c = document.getElementById('canvas');
var ctx = c.getContext("2d");

ctx.width = 500;
ctx.height = 100;

ctx.fillStyle = '#E0E0E0';
ctx.fillRect(0, 0, ctx.width, ctx.height);

var mousedown = false;

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

            //tabElement[i].marginLeft = tabElement[currentRow].marginLeft;
            //tabElement[i].width = (tabElement[i].marginLeft + tabElement[i].width) - (tabElement[currentRow].marginLeft + tabElement[currentRow].width);
        }
    }

    drawElements();
};

c.onmousemove = function(e) {
    var x = e.offsetX==undefined?e.layerX:e.offsetX;

    if(mousedown && currentRow != 'none')
    {
        tabElement[currentRow].marginLeft = x;

        drawElements();
    }
};

function rowTabElement(x) {
    currentRow = 'none';

    for(var i = 0; i < tabElement.length; i++)
    {
        if(tabElement[i].marginLeft <= x && (tabElement[i].marginLeft + tabElement[i].width) >= x)
        {
            console.log('row : ', i);

            currentRow = i;

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
        ctx.lineWidth = '2';
        ctx.strokeStyle = (tabElement[i].selected) ? 'blue' : 'gray';
        ctx.fillStyle = '#66CCFF;';
        ctx.rect(tabElement[i].marginLeft, 0, tabElement[i].width, 100);
        ctx.stroke();
    }
}