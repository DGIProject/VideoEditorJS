var MODE = {
    NONE: 0,
    MOVE: 1,
    RESIZE: {
        LEFT: 2,
        RIGHT: 3
    },
    REMOVE: 4
};

Track = function(id, type, canvas) {
    this.id = id;
    this.type = type;

    this.canvas = canvas;

    this.mode = MODE.NONE;

    this.mousedown = false;
    this.gap = 0;
    this.lastX = 0;

    this.tabElements = [];
    this.tabTransitions = [];

    this.currentRow = -1;

    this.parent = -1;
};

Track.prototype.setParent = function(id) {
    this.parent = id;
};