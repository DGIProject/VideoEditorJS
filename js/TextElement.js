TextElement = function(id, nameText, contentText, colorText, sizeText, posText)
{
    this.id = id;
    this.nameText = nameText;
    this.contentText = contentText;
    this.colorText = colorText;
    this.sizeText = sizeText;
    this.posText = {x: posText.x, y: posText.y};
}

TextElement.prototype.updateValuesElement = function(nameText, contentText, colorText, sizeText, posText)
{
    this.nameText = nameText;
    this.contentText = contentText;
    this.colorText = colorText;
    this.sizeText = sizeText;
    this.posText = {x: posText.x, y: posText.y};
}