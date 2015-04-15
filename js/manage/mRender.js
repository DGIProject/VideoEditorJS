/**
 * Created by Dylan on 10/02/2015.
 */

function makeRender(format) {
    if (isAllUploaded())
    {


        var myElements = document.querySelectorAll(".renderStats");

        for (var i = 0; i < myElements.length; i++) {
            myElements[i].className = myElements[i].className.replace("renderStats", "renderStatsV");
        }

        eId('startedDate').innerHTML = "Début du traitement";
        eId('SrvLoad').innerHTML = "Charge du serveur";

        var timer = window.setInterval(function(){

            var url = remoteAPIPath + 'php/renderStat.php?action=read&id='+currentProject.username+"_"+currentProject.name;

            var xhr = createCORSRequest('GET', url);

            if (!xhr) {
                noty({layout: 'topRight', type: 'error', text: 'Erreur, navigateur incompatible avec les requêtes CORS.', timeout: '5000'});
                return;
            }

            xhr.onload = function() {
                console.log(xhr.responseText);
                var jsonRep = JSON.parse(xhr.responseText);
                if (!jsonRep.hasOwnProperty("code"))
                {
                    //{totcmd:16,actual:16,startTime:18:41:54 31-03-2015}
                    var progress = Math.ceil(jsonRep.actual/jsonRep.totcmd*100);
                    if (progress==100)
                    {
                        eId('startRender').removeAttribute('disable');
                        var myElements = document.querySelectorAll(".renderStatsV");

                        for (var i = 0; i < myElements.length; i++) {
                            myElements[i].className = myElements[i].className.replace("renderStatsV", "renderStats");
                        }
                        noty({layout: 'topRight', type: 'info', text: 'Rendu Terminé  !', timeout: '5000'});
                        clearInterval(timer);

                        url = remoteAPIPath + 'php/renderStat.php?action=delete&id='+currentProject.username+"_"+currentProject.name;
                        var xhr2 = createCORSRequest('GET', url);
                        xhr2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                        xhr2.send();
                        listAvailableRenderFiles();
                    }
                    else
                    {
                        eId('startedDate').innerHTML = "Début du traitement : "+jsonRep.startTime;
                        eId('SrvLoad').innerHTML = "Charge du serveur : "+jsonRep.wait;
                        console.log(progress);
                        eId('renderProgress').style.width = progress+"%";
                    }
                }

            };

            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send();

        }, 10000)

        format = document.getElementById("renderFormat").options[document.getElementById("renderFormat").selectedIndex].value;
        console.log("format", format);
       renderVar = new RenderP(format);
    }
    else
    {
        noty({layout: 'topRight', type: 'error', text: 'Le rendu ne peux pas être lancé, des fichiers sont en cours d\'envois', timeout: '4000'});
    }
}

function listAvailableRenderFiles()
{
    var url = remoteAPIPath + 'php/videoFileManagement.php?action=list&projectName='+currentProject.name;

    var xhr = createCORSRequest('GET', url);

    if (!xhr) {
        noty({layout: 'topRight', type: 'error', text: 'Erreur, navigateur incompatible avec les requêtes CORS.', timeout: '5000'});
        return;
    }

    xhr.onload = function() {
        console.log(xhr.responseText);
        var jsonRep = JSON.parse(xhr.responseText);

        var ul = document.getElementById('renderList');
        ul.innerHTML = "";
        var li, button;

        for (i=0;i<jsonRep.length;i++)
        {
            var url2 = remoteAPIPath + 'php/videoFileManagement.php?action=read&id='+jsonRep[i]+'&projectName='+currentProject.name;
            li=document.createElement("li");
            li.setAttribute("class","list-group-item");
            li.innerHTML = '<a href="'+url2+'" target="_blank">'+jsonRep[i]+'</a><button class="btn btn-xs btn-danger pull-right" onclick="deleteRender(\''+jsonRep[i]+'\')" type="button"><span class="glyphicon glyphicon-remove"></span></button><button onclick="viewVideoFile(\''+jsonRep[i]+'\')" class="btn btn-xs btn-default pull-right" type="button"><span class="glyphicon glyphicon-play"></span></button>'
            ul.appendChild(li);
        }

    };

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send();
}

function deleteRender(id)
{
    var url = remoteAPIPath + 'php/videoFileManagement.php?action=delete&id='+id+'&projectName='+currentProject.name;

    var xhr = createCORSRequest('GET', url);

    if (!xhr) {
        noty({layout: 'topRight', type: 'error', text: 'Erreur, navigateur incompatible avec les requêtes CORS.', timeout: '5000'});
        return;
    }

    xhr.onload = function() {
        console.log(xhr.responseText);
        listAvailableRenderFiles();
    };

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send();
}
function viewVideoFile(id)
{
    document.getElementById('videoRender').src = remoteAPIPath + 'php/videoFileManagement.php?action=read&id='+id.split(".")[0]+'_WEB.mp4'+'&projectName='+currentProject.name;
    $("#viewRenderModal").modal('show');

}