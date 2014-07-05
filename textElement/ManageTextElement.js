ManageTextElement = function(id, canvasId, canvasWidth, elementsId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvas.width = canvasWidth;
    this.canvas.height = this.canvas.width / 1.77;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.elementsId = elementsId;

    this.isEnabled = true;
};

ManageTextElement.prototype.disableTextElement = function() {
    this.isEnabled = false;
};

ManageTextElement.prototype.newTextElement = function(id) {
    //Editor
    this.id = id;
    this.nameText = 'Text ' + id;
    this.text = 'Text ' + id;
    this.font = 'Calibri';
    this.sizeText = 50;
    this.color = '#000000';
    this.textAlign = 'center';

    //TextElement
    this.posElement = {
        x : (this.canvas.width / 2),
        y : (this.canvas.height / 2)
    };

    this.widthLine = 0;

    this.leftClick = false;
    this.selectedElement = false;

    document.getElementById(this.elementsId.nameText).value = this.nameText;
    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = this.sizeText;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.editTextElement = function(id, nameText, text, font, sizeText, color, textAlign, posElement) {
    //Editor
    this.id = id;
    this.nameText = nameText;
    this.text = text;
    this.font = font;
    this.sizeText = sizeText;
    this.color = color;
    this.textAlign = textAlign;

    //TextElement
    this.posElement = posElement;

    this.widthLine = 0;

    this.leftClick = false;
    this.selectedElement = false;

    document.getElementById(this.elementsId.nameText).value = this.nameText;
    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = this.sizeText;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeNameText = function(nameText) {
    this.nameText = nameText;

    this.enableButtonSaveTextElement();
};

ManageTextElement.prototype.changeFont = function(font, row) {
    this.font = font;

    for(var i = 0; i < 4; i++)
    {
        document.getElementById('buttonFont' + i).classList.remove('active');
    }

    document.getElementById('buttonFont' + row).classList.add('active');

    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeSizeText = function(sizeText) {
    this.sizeText = sizeText;

    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = sizeText;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeColor = function(color) {
    this.color = color;

    this.writeTextToCanvas();
}

ManageTextElement.prototype.changeTextAlign = function(textAlign, row) {
    this.textAlign = textAlign;

    for(var i = 0; i < 3; i++)
    {
        document.getElementById('buttonTextAlign' + i).classList.remove('active');
    }

    document.getElementById('buttonTextAlign' + row).classList.add('active');

    this.writeTextToCanvas();
};

ManageTextElement.prototype.changePosElement = function(x, y) {
    this.posElement.x = this.posElement.x + x;
    this.posElement.y = this.posElement.y + y;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.writeTextToCanvas = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    console.log(this.sizeText, this.sizeText);

    this.context.font = this.sizeText + 'pt ' + this.font;
    this.context.textAlign = this.textAlign;
    //this.context.textBaseline = 'middle';
    this.context.fillStyle = this.color;

    var enterInContent = this.text.split('|');

    this.widthLine = 0;

    for(var i = 0; i < enterInContent.length; i++)
    {
        if(this.context.measureText(enterInContent[i]).width > this.widthLine)
        {
            this.widthLine = Math.round(this.context.measureText(enterInContent[i]).width);
        }

        this.context.fillText(enterInContent[i], this.posElement.x, (this.posElement.y + ((i * this.sizeText) + 5)));
    }

    var xWidth = 0;

    if(this.textAlign == 'center')
    {
        xWidth = (this.widthLine / 2);
    }
    else if(this.textAlign == 'right')
    {
        xWidth = this.widthLine;
    }

    this.context.fillStyle = 'rgba(180, 217, 243, 0.2)';
    this.context.fillRect(((this.posElement.x - xWidth) - 5), ((this.posElement.y - this.sizeText)), (this.widthLine + 10), ((enterInContent.length * this.sizeText) + 15));

    //context.fillStyle = (selectedElement) ? 'rgba(116, 239, 63, 1)' : 'rgba(69, 176, 228, 1)';
    //context.fillRect(((posX - xWidth) - 5), (posY - sizeText), (widthLine + 10), 2);
    //context.fillRect((((posX - xWidth) - 5 + (widthLine + 10)) - 2), (posY - sizeText), 2, ((enterInContent.length * sizeText) + 15));
    //context.fillRect((((posX - xWidth) - 5)), (((posY - sizeText) + ((enterInContent.length * sizeText) + 15)) - 2), (widthLine + 10), 2);
    //context.fillRect(((posX - xWidth) - 5), (posY - sizeText), 2, ((enterInContent.length * sizeText) + 15));

    this.enableButtonSaveTextElement();
};

ManageTextElement.prototype.isOnArea = function(xClient, yClient) {
    var x = (xClient + window.scrollX) - $('#' + this.canvasId).offset().left;
    var y = (yClient + window.scrollY) - $('#' + this.canvasId).offset().top;

    console.log(x, y);
    console.log(this.posElement.x, this.posElement.y);

    var enterInContent = this.text.split('|');

    var xWidth = 0;

    if(this.textAlign == 'center')
    {
        xWidth = (this.widthLine / 2);
    }
    else if(this.textAlign == 'right')
    {
        xWidth = this.widthLine;
    }

    return x >= ((this.posElement.x - xWidth) - 5) && y >= (this.posElement.y - this.sizeText) && x <= ((this.posElement.x - xWidth) + this.widthLine + 5) && y <= ((this.posElement.y - this.sizeText) + (enterInContent.length * this.sizeText) + 15);
};

ManageTextElement.prototype.enableButtonSaveTextElement = function() {
    if(this.nameText != '' && this.text != '')
    {
        document.getElementById(this.elementsId.buttonSaveTextElement).removeAttribute('disabled');
    }
    else
    {
        document.getElementById(this.elementsId.buttonSaveTextElement).setAttribute('disabled', '');
    }
};

ManageTextElement.prototype.mouseDown = function(xClient, yClient, buttonClient) {
    if(this.isOnArea(xClient, yClient))
    {
        this.selectedElement = true;

        if(buttonClient == 0)
        {
            this.leftClick = true;
        }
    }
    else
    {
        this.selectedElement = false;
    }

    this.writeTextToCanvas();
};

ManageTextElement.prototype.mouseUp = function(buttonClient) {
    if(buttonClient == 0)
    {
        this.leftClick = false;
    }
};

ManageTextElement.prototype.mouseMove = function(xClient, yClient) {
    if(this.leftClick)
    {
        var xMouse = xClient + window.scrollX;
        var yMouse = yClient + window.scrollY;

        var x = 0, y = 0;

        if(xMouse < this.lastXMouse)
        {
            x = -1.35;
        }

        if(xMouse > this.lastXMouse)
        {
            x = 1.35;
        }

        if(yMouse < this.lastYMouse)
        {
            y = -1.35;
        }

        if(yMouse > this.lastYMouse)
        {
            y = 1.35;
        }

        this.lastXMouse = xMouse;
        this.lastYMouse = yMouse;

        this.changePosElement(x, y);
    }
};

ManageTextElement.prototype.keyPress = function(keyCodeClient, charCodeClient)
{
    if(this.selectedElement)
    {
        if(keyCodeClient == 8)
        {
            this.text = this.text.substr(0, (this.text.length - 1));
        }
        else if(keyCodeClient == 13)
        {
            this.text += '|';
        }
        else
        {
            this.text += String.fromCharCode((charCodeClient));
        }

        this.writeTextToCanvas();
    }
};

var currentManageTextElement;

window.onload = function()
{
    currentManageTextElement = new ManageTextElement(0, 'textElement', 750, {nameText : 'nameText', sizeText : 'sizeText', sizeTextInfo : 'sizeTextInfo', colorText : 'colorText', buttonSaveTextElement : 'buttonSaveTextElement'});
};

document.onmousedown = function(e)
{
    if(currentManageTextElement.isEnabled)
    {
        currentManageTextElement.mouseDown(e.clientX, e.clientY, e.button);
    }
};

document.onmouseup = function(e)
{
    if(currentManageTextElement.isEnabled)
    {
        currentManageTextElement.mouseUp(e.button);
    }
};

document.onmousemove = function(e)
{
    if(currentManageTextElement.isEnabled)
    {
        currentManageTextElement.mouseMove(e.clientX, e.clientY);
    }
};

document.onkeypress = function(e)
{
    if(currentManageTextElement.isEnabled)
    {
        currentManageTextElement.keyPress(e.keyCode, e.charCode);
    }
};