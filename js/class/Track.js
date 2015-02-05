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
    this.scroll = 0;

    this.volume = 0;
    this.data = null;

    this.tabElements = [];
    this.currentRow = 0;
};

Track.prototype.upVolume = function(newLevel) {
    this.volume = newLevel;
};