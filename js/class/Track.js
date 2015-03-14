var MODE = {
    NONE: 0,
    MOVE: 1,
    RESIZE: {
        LEFT: 2,
        RIGHT: 3
    },
    REMOVE: 4
};

Track = function(id, type, canvas, parent) {
    this.id = id;
    this.type = type;

    this.canvas = canvas;

    this.mode = MODE.NONE;

    this.mousedown = false;
    this.gap = 0;
    this.lastX = 0;

    this.tabElements = [];
    this.currentRow = 0;

    this.parent = parent;
};

Track.prototype.setParent = function(id) {
    this.parent = id;
};