Render = function (tabListElements, tabListFiles, tabListTextElements, tabListTracks, state) {
    this.Elements = tabListElements;
    this.Files = tabListFiles;
    this.Tracks = tabListTracks;
    this.videoLenthPx = 0; //PX !!!
    this.videoDuration = 0 //Secondes !!
    this.state = state;
    this.resolution = (state=='prev')? "320x180" : "1280x720";

    console.log(this.Files);
    console.log(this.Files.length);
    console.log(this.Files[this.Files.length-1]);
    console.log("id = ",this.Files[this.Files.length-1].id);
    var newId = parseInt(this.Files[this.Files.length-1].id)+1;
    console.log("n ==== ",newId);
	this.blackImageFile = new FileList(newId, 'Image', 0, 'Blackelement', 'png', null);
	this.Files.push(this.blackImageFile);
    this.blackFileId = newId;
    this.prepareElement();

}

Render.prototype.prepareElement = function () {
   /* var ElementIncrementMin = 100000000;
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

    console.log(this)*/
    this.makeCommandTracks();

}

Render.prototype.makeCommandFile = function () {

    //TODO: générer un fichier puis l'envoyer sur le serveur qui va parser et traiter la demande.

    var OAjax;

    if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
    else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');
    OAjax.open('POST', 'php/GenerateCommandFile.php', true);
    OAjax.onreadystatechange = function() {
        if(OAjax.readyState == 4 && OAjax.status == 200) {
            console.log(OAjax.responseText);
        }
    }

    var content = "";
    for (i=0;i<this.commandList.length;i++)
    {
        content += this.commandList[i].cmd +"\n"
        console.log(this.commandList[i].cmd)
    }


    OAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    OAjax.send('contentFile=' + content + '&nameProject=' + currentProject.name);


    //$("#loadingDivConvert").modal('hide');
}
Render.prototype.makeCommandTracks = function () {

    this.commandList = [];
    console.log("track are ", this.Tracks);
    for (var avancementPiste =0;avancementPiste<this.Tracks.length;avancementPiste++) // Pour chaque piste
    {
        var pisteActuelle = this.Tracks[avancementPiste]  // on stock la piste
        var elementInPiste = pisteActuelle.elementsId;

        console.log(avancementPiste, "Piste",pisteActuelle, "Element en Piste", elementInPiste);

        for (var avancementElementPiste = 0;avancementElementPiste<elementInPiste.length;avancementElementPiste++) // pour chaque Element de la piste
        {
            curentElement =  this.getElementById(elementInPiste[avancementElementPiste]);

            // Creation d'une commande pour l'element
            curentFileforElement = this.getFileInformationById(curentElement.fileId)

            if (curentFileforElement.type == "2" || curentFileforElement.type == "3"){
                var codec = ""
                switch (curentFileforElement.format)
                {
                    case "png":
                        codec = "png";
                        break
                    case "bmp":
                        codec = "bmp";
                        break
                    case "jpeg":
                        codec = "mjpeg";
                        break
                    case "jpg":
                        codec = "mjpeg";
                        break
                }
                var cmd = "-loop 1 -f image2 -c:v "+codec+" -i file"+curentElement.fileId+".file -i sample.wav -map 0:v -map 1:a -t "+(Math.ceil(curentElement.length/oneSecond))+" -s "+this.resolution+" -c:v libx264  -pix_fmt yuv420p -y "+curentElement.fileId+".mp4";
                console.log(cmd)
                this.commandList.push({cmd: cmd, fileId : curentElement.fileId});
            }
            else{

            }

            if (avancementElementPiste+1<elementInPiste.length) // on verifie qu'il existe un element apres
            {
                nextElement = this.getElementById(elementInPiste[avancementElementPiste+1]);
                if (nextElement.marginXsecond != 0)
                {
                   // console.log("Create blackElement");
                    var cmd = "-loop 1 -f image2 -c:v png -i black.png -i sample.wav -map 0:v -map 1:a -t "+nextElement.marginXsecond+" -s "+this.resolution+" -c:v libx264  -pix_fmt yuv420p -y "+this.blackFileId+".mp4";
                    console.log(cmd);
                    this.commandList.push({cmd: cmd, fileId : this.blackFileId});
                }

            }
        }
    }

    this.lastCmd = ''
    complexfliter = '-filter_complex \''
    ending = "concat=n="+this.commandList.length+":v=1:a=1:unsafe=1 [v] [a]' -map '[v]' -map '[a]'  -aspect 16:9 -s "+this.resolution+" -c:v libx264 -pix_fmt yuv420p -y";

    for (i=0;i<this.commandList.length;i++)
    {
        this.lastCmd += '-i '+this.commandList[i].fileId+'.mp4 '
        complexfliter += '['+i+':0]['+i+':1]'
    }

    this.lastCmd += complexfliter
    this.lastCmd += ending
    this.lastCmd += " out.mp4"

    console.log("LastCmd" + this.lastCmd);

    this.commandList.push({cmd: this.lastCmd})

    console.log(this.commandList);

    this.makeCommandFile();
}
Render.prototype.getElementById = function(id){
    for (i=0;i<this.Elements.length;i++)
    {
        if (this.Elements[i].id == id)
        {
           var element = this.Elements[i];
        }
    }
    return element;
}
Render.prototype.getFileInformationById = function(id){
    for (i=0;i<this.Files.length;i++)
    {
        if (this.Files[i].id == id)
        {
            var file = this.Files[i];
        }
    }
    return file;
}