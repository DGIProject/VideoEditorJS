/**
 * Created by Guillaume on 18/02/14.
 */

currentFileIteration = 0

Render = function (tabListElements, tabListFiles, tabListTextElements, tabListTracks) {
    this.Elements = tabListElements;
    this.Files = tabListFiles;
    this.TextElements = tabListTextElements;
    this.Tracks = tabListTracks;
    this.videoLenthPx = 0; //PX !!!
    this.videoDuration = 0 //Secondes !!

    commandList = [];
    currentFileIteration = 0
	var blackImageFile = new FileList(this.Files.length, 'Image', 0, 'Blackelement', 'png', null);
	this.Files.push(blackImageFile);
	this.blackElementId = this.Files.length-1;
	console.log(this.blackElementId);
    this.prepareElement();

}

Render.prototype.prepareElement = function () {
    var ElementIncrementMin = 100000000;
    var ElementIncrementMinId;
    for (i = 0; i < this.Elements.length; i++) {
        if (this.Elements[i].marginXpx < ElementIncrementMin) {
            ElementIncrementMinId = i;
            ElementIncrementMin = this.Elements[i].marginXpx
        }
    }
    console.log(ElementIncrementMin, ElementIncrementMinId);
    // traitement de tout les element de piste pour connaitre la durée maximale de la Video .
    var ElementEnd;
    for (i = 0; i < this.Elements.length; i++) {
        ElementEnd = this.Elements[i].marginXpx + this.Elements[i].length
        if (ElementEnd > this.videoLenthPx) {
            this.videoLenthPx = ElementEnd + 50
        }
    }

    //At this moment we have the lenth in px of the video so to have de duration we need to convert it ....

    var numberSecond = Math.floor(this.videoLenthPx / oneSecond);
    var convertedTime = new Date();
    convertedTime.setTime(numberSecond * 1000);
    var timeStr = convertedTime.getHours() - 1 + ':' + convertedTime.getMinutes() + ':' + convertedTime.getSeconds();
    this.videoDuration = timeStr;

    // this.makeRenderCommandList();

    //So we have the duration of the student video

    // this.runCommand('-help');
    document.getElementById('renderText').innerHTML = "Convertion de l'élément " + parseInt(currentFileIteration + 1) + "/" + commandList.length
    document.getElementById('progressRender').style.width = parseInt(currentFileIteration + 1) / commandList.length * 100 + "%"

  //  $("#loadingDivConvert").modal('show');

    console.log(this)
    this.makeCommandTracks();

}

Render.prototype.makeCommandFile = function () {
    //TODO: générer un fichier puis l'envoyer sur le serveur qui va parser et traiter la demande.

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', 'php/GenerateCommandFile.php?u=User1', true);
    OAjax.onreadystatechange = function() {
        if(OAjax.readyState == 4 && OAjax.status == 200) {
            console.log(OAjax.responseText);
        }
    }

    var content = "";
    for (i=0;i<this.listCommand.length;i++)
    {
        content += this.listCommand[i].command +"\n"
        console.log(this.listCommand[i].command)
    }

    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send('contentFile=' + content + '&nameProject=' + currentProject.name);


    //$("#loadingDivConvert").modal('hide');
}
Render.prototype.makeCommandTracks = function () {
    // Elements
    this.listCommand = [];
    var px = 0;
    var continuer = 0;
    this.infoElements = [];
    var noncollee = 0, noncolleeTenS = 0;

    // Pour chaque piste
    for (trackIteration = 0; trackIteration < this.Tracks.length; trackIteration++) {
        trackElements = this.Tracks[trackIteration].elementsId;
        console.log('ELement de la piste: ', trackElements);
        noncollee = 0;
        noncolleeTenS = 0
        //Pour chaque element de la piste
        for (elementTrackIteration = 0; elementTrackIteration < trackElements.length; elementTrackIteration++) {
            currentElementIdFromTrack = trackElements[elementTrackIteration];
            currentElement = this.Elements[currentElementIdFromTrack];
            console.log("Current Element", currentElement)
            // On test si c'est pas le dernier element
            console.log("current ELement ID from track : ", currentElementIdFromTrack)

            if (elementTrackIteration + 1 < trackElements.length) {
                nextElementId = trackElements[elementTrackIteration + 1];
                nextElement = this.Elements[nextElementId];
                console.log("Element suivant ID: ", nextElementId, nextElement);

                startPosNextElement = nextElement.offset
                endPosCurrentElement = currentElement.offset + currentElement.length

                console.log("Position Element : Start next:", startPosNextElement, "End current : ", endPosCurrentElement)
                if (startPosNextElement == endPosCurrentElement) {
                    // Si les éléments sont collé ...
                    console.log("l'element collé !!! ");

                    var tempCommand

                    if (this.Files[currentElement.fileId].type == "text" )
                    {
                        tempCommand = "-loop 1 -i title"+currentElement.fileId+".png -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4";
                    }
                    else
                    {
                        tempCommand = "-i file"+currentElement.fileId+".file -ss " + parseInt(currentElement.getStartTimeFromStartLenth()) + " -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4"
                    }

                    this.listCommand.push({command: tempCommand, fileId: currentElement.fileId, elementIdInTab: currentElementIdFromTrack});
                    this.infoElements.push({start: currentElement.offset, end: currentElement.offset + currentElement.length})

                }
                else {
                    // Si deux element ne sont pas colle
                    console.log("l'element non collé !!! ");
                    // on crée un element fictif qui va correcpondre a une image noire.
                    // 1) on calcule la longueur en pixel :

                    ecart = Math.abs(startPosNextElement - endPosCurrentElement);
                    durre = Math.ceil(ecart / oneSecond);

                    console.log("Il y a un ecart de ", ecart, " pixels soit ", durre, " secondes");

                    var tempCommand

                    if (this.Files[currentElement.fileId].type == "text" )
                    {
                        tempCommand = "-loop 1 -i title"+currentElement.fileId+".png -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4";
                    }
                    else
                    {
                        tempCommand = "-i file"+currentElement.fileId+".file -ss " + parseInt(currentElement.getStartTimeFromStartLenth()) + " -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4"
                    }
                    // on ajoute le fichier d'avant
                    this.listCommand.push({command: tempCommand, fileId: currentElement.fileId, elementIdInTab: currentElementIdFromTrack});
                    this.infoElements.push({start: currentElement.offset, end: currentElement.offset + currentElement.length})

                    // Full element !!
                    var blackElement = new Elements(this.Elements.length, "black.png", "00:00:"+ecart, null, trackIteration);
                    this.Elements.push(blackElement);


                    var tempCommand = "-loop 1 -i black.png -t "+ecart+" "+parseInt(this.Elements.length-1)+".mp4";
                    this.listCommand.push({command: tempCommand, fileId: this.blackElementId , elementIdInTab: this.Elements[this.Elements.length - 1]});
                    this.infoElements.push({start: endPosCurrentElement, end: endPosCurrentElement + blackElement.length, black: true})

                    noncollee++;
                }

            }
            else {
                // cela veux dire que c'est le dernier !
                console.log("C'est le dernier avec Iteration ", elementTrackIteration);

                //Ajout des information pour générer les fichier qui correspondent
                var tempCommand

                if (this.Files[currentElement.fileId].type == "text" )
                {
                    tempCommand = "-loop 1 -i title"+currentElement.fileId+".png -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4";
                }
                else
                {
                    tempCommand = "-i file"+currentElement.fileId+".file -ss " + parseInt(currentElement.getStartTimeFromStartLenth()) + " -t " + parseInt(currentElement.getDurationInSecondFromCurrentDuration() - currentElement.startTime) + " " + currentElement.id + ".mp4"
                }

                this.listCommand.push({command: tempCommand, fileId: currentElement.fileId, elementIdInTab: currentElementIdFromTrack});
                this.infoElements.push({start: currentElement.offset, end: currentElement.offset + currentElement.length})

            }
        }

    }
    console.log(this.listCommand);
    console.log(this.infoElements);
    console.log(this.Elements);
    console.log("il y a ", noncollee, "element non collé");
    this.makeCommandFile();
    //commandList = listCommand;
}