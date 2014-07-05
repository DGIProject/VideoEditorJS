TextElement = function(id, nameText, contentText, fontText, sizeText, colorText, alignText, posText)
{
    this.id = id;
    this.nameText = nameText;
    this.contentText = contentText;
    this.fontText = fontText;
    this.sizeText = sizeText;
    this.colorText = colorText;
    this.alignText = alignText;
    this.posText = posText;
};

TextElement.prototype.updateValuesElement = function(nameText, contentText, fontText, sizeText, colorText, alignText, posText)
{
    this.nameText = nameText;
    this.contentText = contentText;
    this.fontText = fontText;
    this.sizeText = sizeText;
    this.colorText = colorText;
    this.alignText = alignText;
    this.posText = posText;
};