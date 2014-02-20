Track = function(id, name) {
    this.id = id;
    this.name = name;
    this.volume = 0; // under 100
    this.elementsId = [];
}
Track.prototype.changeName = function(newName)
{
    this.name = newName;
}
Track.prototype.changeVolume = function(newLevel)
{
    this.volume = newLevel;
}