function Element(id, width, marginLeft) {
    this.id = id;
    
    this.width = width;
    this.marginLeft = marginLeft;

    this.minWidth = 20;
    this.maxWidth = 150;

    this.selected = true;
}