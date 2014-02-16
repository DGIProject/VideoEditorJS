Track = function(id, name, fileName) {
    this.id = id;
    this.name = name;
    this.fileName = fileName;
    this.volume = 0; // under 100
}
Track.prototype.changeName = function(newName)
{
    this.name = newName;
}
Track.prototype.changeVolume = function(newLevel)
{
    this.volume = newLevel;
}