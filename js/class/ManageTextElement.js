ManageTextElement = function(id, canvasId, canvasWidth, elementsId) {
    this.canvasId = canvasId;

    this.canvas = document.getElementById(canvasId);
    this.canvas.onmousemove = this.mouseMove;
    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmouseup = this.mouseUp;
    window.onkeypress = this.keyPress;

    this.context = this.canvas.getContext('2d');

    this.canvas.width = canvasWidth;
    this.canvas.height = this.canvas.width / 1.77;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.elementsId = elementsId;

    this.isEditing = false;
    this.isEnabled = false;
};

ManageTextElement.prototype.disableTextElement = function() {
    this.isEnabled = false;
};

ManageTextElement.prototype.newTextElement = function(id) {
    //Editor
    this.id = id;
    this.fileId = null;
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

    this.isEditing = false;
    this.isEnabled = true;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.editTextElement = function(fileId, properties) {
    //Editor
    this.id = properties.id;
    this.fileId = fileId;
    this.nameText = properties.nameText;
    this.text = properties.contentText;
    this.font = properties.font;
    this.sizeText = properties.sizeText;
    this.color = properties.color;
    this.textAlign = properties.textAlign;

    //TextElement
    this.posElement = properties.posText;

    this.widthLine = 0;

    this.leftClick = false;
    this.selectedElement = false;

    document.getElementById(this.elementsId.nameText).value = this.nameText;
    document.getElementById(this.elementsId.colorText).value = this.color;

    document.getElementById(this.elementsId.sizeText).value = this.sizeText;
    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = this.sizeText;

    this.isEditing = true;
    this.isEnabled = true;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeNameText = function(nameText) {
    this.nameText = nameText;
    this.enableButtonSaveTextElement();
};

ManageTextElement.prototype.changeFont = function(font) {
    this.font = font;
    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeSizeText = function(sizeText) {
    this.sizeText = sizeText;

    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = sizeText;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeColor = function(color) {
    console.log('changeColor');
    this.color = color;
    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeTextAlign = function(textAlign) {
    this.textAlign = textAlign;
    this.writeTextToCanvas();
};

ManageTextElement.prototype.changePosElement = function(x, y) {
    this.posElement.x = this.posElement.x + x;
    this.posElement.y = this.posElement.y + y;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.writeTextToCanvas = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

    this.context.fillStyle = (this.selectedElement) ? 'rgba(173, 250, 190, 1)' : 'rgba(221, 248, 251, 1)';
    this.context.fillRect(((this.posElement.x - xWidth) - 5), (this.posElement.y - this.sizeText), (this.widthLine + 10), 1);
    this.context.fillRect((((this.posElement.x - xWidth) - 5 + (this.widthLine + 10)) - 1), (this.posElement.y - this.sizeText), 1, ((enterInContent.length * this.sizeText) + 15));
    this.context.fillRect((((this.posElement.x - xWidth) - 5)), (((this.posElement.y - this.sizeText) + ((enterInContent.length * this.sizeText) + 15)) - 1), (this.widthLine + 10), 1);
    this.context.fillRect(((this.posElement.x - xWidth) - 5), (this.posElement.y - this.sizeText), 1, ((enterInContent.length * this.sizeText) + 15));

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

ManageTextElement.prototype.getInformationsTextElement = function() {
    return {id : this.id, nameText : this.nameText, text : this.text, font : this.font, sizeText : this.sizeText, color : this.color, textAlign : this.textAlign, posElement : this.posElement};
};

ManageTextElement.prototype.mouseDown = function(e) {
    console.log(e.clientX, e.clientY);

    if(currentManageTextElement.isOnArea(e.clientX, e.clientY))
    {
        currentManageTextElement.selectedElement = true;

        if(e.button == 0)
        {
            currentManageTextElement.leftClick = true;
        }
    }
    else
    {
        currentManageTextElement.selectedElement = false;
    }

    currentManageTextElement.writeTextToCanvas();
};

ManageTextElement.prototype.mouseUp = function(e) {
    if(e.button == 0)
    {
        currentManageTextElement.leftClick = false;
    }
};

ManageTextElement.prototype.mouseMove = function(e) {
    if(currentManageTextElement.leftClick)
    {
        var xMouse = e.clientX + window.scrollX;
        var yMouse = e.clientY + window.scrollY;

        var x = 0, y = 0;

        if(xMouse < currentManageTextElement.lastXMouse)
        {
            x = -1.35;
        }

        if(xMouse > currentManageTextElement.lastXMouse)
        {
            x = 1.35;
        }

        if(yMouse < currentManageTextElement.lastYMouse)
        {
            y = -1.35;
        }

        if(yMouse > currentManageTextElement.lastYMouse)
        {
            y = 1.35;
        }

        currentManageTextElement.lastXMouse = xMouse;
        currentManageTextElement.lastYMouse = yMouse;

        currentManageTextElement.changePosElement(x, y);
    }
};

ManageTextElement.prototype.keyPress = function(e)
{
    if(currentManageTextElement.selectedElement)
    {
        if(e.keyCode == 8)
        {
            currentManageTextElement.text = currentManageTextElement.text.substr(0, (currentManageTextElement.text.length - 1));
        }
        else if(e.keyCode == 13)
        {
            currentManageTextElement.text += '|';
        }
        else
        {
            currentManageTextElement.text += String.fromCharCode((e.charCode));
        }

        currentManageTextElement.writeTextToCanvas();
    }
};