var canvas = document.getElementById('textElement');
var context = canvas.getContext('2d');
var posX = 10, posY = 20;

var lastXMouse, lastYMouse;

var leftClick = false;

window.onload = function()
{
    initializeTextElement();
};

document.getElementById('textElement').onmousedown = function(e)
{
    if(e.button == 0)
    {
        leftClick = true;
    }
};

document.onmouseup = function(e)
{
    if(e.button == 0)
    {
        leftClick = false;
    }
};

document.onmousemove = function(e)
{
    if(leftClick)
    {
        var xMouse, yMouse;

        xMouse = e.clientX + window.scrollX;
        yMouse = e.clientY + window.scrollY;

        var x = 0, y = 0;

        if(xMouse < lastXMouse)
        {
            x = -1.7;
        }

        if(xMouse > lastXMouse)
        {
            x = 1.7;
        }

        if(yMouse < lastYMouse)
        {
            y = -1.7;
        }

        if(yMouse > lastYMouse)
        {
            y = 1.7;
        }

        lastXMouse = xMouse;
        lastYMouse = yMouse;

        writeTextToCanvas(x, y);
    }
};

document.onkeypress = function(e)
{
    var contentText = document.getElementById('contentText');

    if(e.keyCode == 8)
    {
        contentText.value = contentText.value.substr(0, (contentText.value.length - 1));
    }
    else if(e.keyCode == 13)
    {
        contentText.value += '|';
    }
    else
    {
        contentText.value += String.fromCharCode((e.charCode));
    }

    writeTextToCanvas(0, 0);
};

function initializeTextElement()
{
    canvas.width = 650;
    canvas.height = 367;

    context.clearRect(0, 0, 650, 367);

    document.getElementById('nameText').value = 'Text 1';
    document.getElementById('contentText').value = 'Text 1';

    writeTextToCanvas((canvas.width / 2), (canvas.height / 2));
}

function writeTextToCanvas(x, y)
{
    var contentText = document.getElementById('contentText').value;
    var sizeText = document.getElementById('sizeText').value;

    context.clearRect(0, 0, 650, 367);
    context.font = document.getElementById('sizeText').value + 'pt Calibri';

    posX = posX + x;
    posY = posY + y;

    context.textAlign = 'center';
    //context.textBaseline = 'middle';
    context.fillStyle = document.getElementById('colorText').value;

    var enterInContent = contentText.split('|');
    var widthLine = 0;

    for(var i = 0; i < enterInContent.length; i++)
    {
        if(context.measureText(enterInContent[i]).width > widthLine)
        {
            widthLine = Math.round(context.measureText(enterInContent[i]).width);
        }

        context.fillText(enterInContent[i], posX, (posY + ((i * sizeText) + 5)));
    }

    context.fillStyle = 'rgba(180, 217, 243, 0.2)';
    context.fillRect(((posX - (widthLine / 2)) - 5), ((posY - sizeText)), (widthLine + 10), ((enterInContent.length * sizeText) + 15));

    context.fillStyle = 'rgba(69, 176, 228, 1)';
    context.fillRect(((posX - (widthLine / 2)) - 5), (posY - sizeText), (widthLine + 10), 2);
    context.fillRect((((posX - (widthLine / 2)) - 5 + (widthLine + 10)) - 2), (posY - sizeText), 2, ((enterInContent.length * sizeText) + 15));
    context.fillRect((((posX - (widthLine / 2)) - 5)), (((posY - sizeText) + ((enterInContent.length * sizeText) + 15)) - 2), (widthLine + 10), 2);
    context.fillRect(((posX - (widthLine / 2)) - 5), (posY - sizeText), 2, ((enterInContent.length * sizeText) + 15));
}