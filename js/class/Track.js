Track = function(id, name, type) {
    this.id = id;
    this.name = name;
    this.volume = 0; // under 100
    this.elementsId = [];
    this.data = null;
    this.type = type;
    this.color = (type=="movie")? "#A3BDDE" : "#74E4BC";
}

Track.prototype.changeName = function(newName)
{
    this.name = newName;
}

Track.prototype.changeVolume = function(newLevel)
{
    this.volume = newLevel;
}