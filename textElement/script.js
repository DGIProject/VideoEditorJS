var canvas = document.getElementById('textElement');
var context = canvas.getContext('2d');
var posX = 10, posY = 20;

var lastXMouse, lastYMouse;

var leftClick = false;

var selectedElement = false;

var contentText = '';
var currentFont = 'Calibri';
var alignType = 'center';

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

    if(detectInZone(e.clientX, e.clientY))
    {
        console.log('true');

        selectedElement = true;
    }
    else
    {
        console.log('false');

        selectedElement = false;
    }

    writeTextToCanvas(0, 0);
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
    if(selectedElement)
    {
        if(e.keyCode == 8)
        {
            contentText = contentText.substr(0, (contentText.length - 1));
        }
        else if(e.keyCode == 13)
        {
            contentText += '|';
        }
        else
        {
            contentText += String.fromCharCode((e.charCode));
        }

        writeTextToCanvas(0, 0);
    }
};

function initializeTextElement()
{
    canvas.width = 750;
    canvas.height = 423;

    context.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById('nameText').value = 'Text 1';

    writeTextToCanvas((canvas.width / 2), (canvas.height / 2));
}

function changeFont(font, row)
{
    currentFont = font;

    for(var i = 0; i < 4; i++)
    {
        document.getElementById('buttonFont' + i).classList.remove('active');
    }

    document.getElementById('buttonFont' + row).classList.add('active');

    writeTextToCanvas(0, 0);
}

function alignText(type, row)
{
    alignType = type;

    for(var i = 0; i < 3; i++)
    {
        document.getElementById('buttonAlign' + i).classList.remove('active');
    }

    document.getElementById('buttonAlign' + row).classList.add('active');

    writeTextToCanvas(0, 0);
}

function writeTextToCanvas(x, y)
{
    var sizeText = document.getElementById('sizeText').value;

    document.getElementById('sizeTextInfo').innerHTML = sizeText;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = document.getElementById('sizeText').value + 'pt ' + currentFont;

    posX = posX + x;
    posY = posY + y;

    context.textAlign = alignType;
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

    var xWidth = 0;

    if(alignType == 'center')
    {
        xWidth = (widthLine / 2);
    }
    else if(alignType == 'right')
    {
        xWidth = widthLine;
    }

    context.fillStyle = 'rgba(180, 217, 243, 0.2)';
    context.fillRect(((posX - xWidth) - 5), ((posY - sizeText)), (widthLine + 10), ((enterInContent.length * sizeText) + 15));

    context.fillStyle = (selectedElement) ? 'rgba(116, 239, 63, 1)' : 'rgba(69, 176, 228, 1)';
    context.fillRect(((posX - xWidth) - 5), (posY - sizeText), (widthLine + 10), 2);
    context.fillRect((((posX - xWidth) - 5 + (widthLine + 10)) - 2), (posY - sizeText), 2, ((enterInContent.length * sizeText) + 15));
    context.fillRect((((posX - xWidth) - 5)), (((posY - sizeText) + ((enterInContent.length * sizeText) + 15)) - 2), (widthLine + 10), 2);
    context.fillRect(((posX - xWidth) - 5), (posY - sizeText), 2, ((enterInContent.length * sizeText) + 15));

    verifyFieldTextElement();
}

function detectInZone(xClient, yClient)
{
    var x = (xClient + window.scrollX) - $('#textElement').offset().left;
    var y = (yClient + window.scrollY) - $('#textElement').offset().top;

    console.log(x, y);
    console.log(posX, posY);

    return x >= posX && y >= posY;
}

function verifyFieldTextElement()
{
    var nameText = document.getElementById('nameText').value;

    if(nameText != '' && contentText != '')
    {
        document.getElementById('buttonSaveTextElement').removeAttribute('disabled');
    }
    else
    {
        document.getElementById('buttonSaveTextElement').setAttribute('disabled', '');
    }
}