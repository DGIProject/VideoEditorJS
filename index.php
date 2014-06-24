<?php
    include "../model/sql_connect.php";
    if (!isset($_SESSION['user']))
    {
        echo 'Vous devez vous connecter avec un compte elève avant toute chose';
        exit(0);
    }
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>VideoEditorJS</title>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
<div class="container">
    <h1>VideoEditorJS</h1>
    <div id="editor">
        <div id="errors"></div>
        <div class="toolbar">
            <button onclick="newProjectModal(true);" class="btn btn-default">New project</button>
            <button onclick="openProject();" class="btn btn-default">Open project</button>
            <button onclick="saveProject();" class="btn btn-primary"><span class="glyphicon glyphicon-save"></span></button>
            <button onclick="addTrack();" class="btn btn-default">New track</button>
            <button onclick="makeRender();" class="btn btn-default">Render</button>
            <button class="btn btn-default" id="btnResize" onclick="activeResize();"><span class="glyphicon glyphicon-resize-small"></span></button>
            <a href="#" onclick="zoomMoins();"><span class="glyphicon glyphicon-zoom-out" ></span></a>
            <input  class="form-control" type="range" id="zoomRange" step="1" onchange="changeZoom(this.value);" style="display: inline-block; width: 150px;" name="zoom" min="1" value="5" max="10">
            <a href="#" onclick="zoomPlus();"><span class="glyphicon glyphicon-zoom-in"></span></a>
            <span id="currentProject">Project : Aucun projet ouvert</span>
        </div>
        </br>
        <div class="row" id="globalEdit"">
            <div class="col-md-9 chronologicalView well" id="offsetBlank">
                <div class="timeTrack">
                    <span class="timeLeft" id="startTime">0h0m0s</span>
                    <span class="timeRight" id="endTime">0h2m40s</span>
                </div>
                <div id="tracks"></div>
                <div id="VideoView" onscroll="scroolAllTracks();" class="videoViewEditor"></div>
            </div>
            <div class="col-md-2 filesList well">
                <span class="titleSize strong">Eléments</span>
                </br>
                <div class="toolbar">
                    <button type="button" class="btn btn-default" onclick="$('#fileLoader').click();"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-file"></span></button>
                    <button type="button" class="btn btn-default" onclick="newTextElement();"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-text-width"></span></button>
                    <button type="button" class="btn btn-default" onclick="newRecord();"><span class="glyphicon glyphicon-record"></span></button>
                    <button type="button" class="btn btn-block btn-danger" onclick="stopAddFileToTrack();" style="margin-top: 5px;display: none;" id="stopAddFileToTrackButton">STOP</button>
                    <hr/>
                    <div style="display: none;"><input type="file" onchange="addMultimediaFile();" id="fileLoader"/></div>
                </div>
                <div id="listFilesLib" class="list-group listFilesLib"></div>
            </div>
        </div>
    </div>
    <div id="selectFileLib" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Information & option</h4>
                </div>
                <div class="modal-body">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <h3 class="panel-title" id="libFileName">Undefined</h3>
                        </div>
                        <div class="panel-body">
                            Taille: <span id="libFileSize"></span><br/>
                            Format: <span id="libFileFormat"></span><br/>
                            Durée: <span id="libFileDuration"></span><br/>
                            Aperçu: <span id="libFilePreview" style="width: 100px;height: 100px"></span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-info" id="fileEditButton" data-dismiss="modal">Edit</button>
                    <button type="button" class="btn btn-danger" id="fileRemoveButton" data-dismiss="modal">Remove</button>
                </div>
            </div>
        </div>
    </div>
    <div id="loadingDiv" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="progress progress-striped active">
                        <div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                            <span class="sr-only">100% Complete</span>
                        </div>
                    </div>
                    <span class="marginauto">Chargement en cours ...</span>
                </div>
            </div>
        </div>
    </div>
    <div id="startLoadingJS" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Bienvenue sur VideoEditorJS</h4>
                </div>
                <div class="modal-body">
                    <p>VideoEditorJS est un projet qui vous permet de faire votre montage vidéo directement en ligne. Il est encore en développement mais pour l'instant vous avez la possibilité d'ajouter des vidéos, musiques, images, titres.</p>
                    </br>
                    <div id="loadingProgressProject">
                        <div class="progress progress-striped active">
                            <div id="downloadJSProgress" class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                <span class="sr-only">0% Complete</span>
                            </div>
                        </div>
                        <span class="marginauto strong">Chargement en cours ... <span id="persentProgress">0%</span></span>
                    </div>
                    <div id="startUseProject" style="display: none;">
                        <button type="button" class="btn btn-lg btn-block btn-success" data-dismiss="modal">Let's go !</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="newProjectModal" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Entrez le nom de votre projet</h4>
                </div>
                <div class="modal-body">
                    <form class="form-inline">
                        <div class="form-group">
                            <input type="text" id="nameProject" name="nameProject" class="form-control" placeholder="Nom du projet">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" id="buttonNewProject" class="btn btn-primary">Créer le projet</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Annuler</button>
                </div>
            </div>
        </div>
    </div>
    <div id="selectProjectModal" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Choisissez le project</h4>
                </div>
                <div class="modal-body">
                    <div id="listProjects" class="list-group">Aucun projet présent.</div>
                    <button type="button" onclick="newProjectModal(true);" class="btn btn-primary" data-dismiss="modal">Nouveau projet</button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Annuler</button>
                </div>
            </div>
        </div>
    </div>
    <div id="fileTextModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Ajouter un élément texte</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-9 center">
                            <canvas id="textRender" width="400px" height="300px" style="border: 1px solid #000000;"></canvas>
                        </div>
                        <div class="col-xs-3 center propertiesDivText">
                            <div>
                                Nom : <input class="form-control" onkeyup="verifyFieldTextElement();" id="nameText" type="text"><br/>
                                Texte : <input class="form-control" onkeyup="writeTextToCanvas(0, 0);" id="contentText" type="text"><br/>
                                Couleur : <input class="form-control" onchange="writeTextToCanvas(0, 0);" id="colorText" type="color"><br/>
                                Taille : <input class="form-control" min="10" max="70" step="2" onchange="writeTextToCanvas(0, 0);" id="sizeText" type="range"><br/>
                            </div>
                            <div>
                                Position :</br>
                                <button type="button" class="btn btn-sm btn-default" onclick="writeTextToCanvas(-5, 0);"><span class="glyphicon glyphicon-chevron-left"></span></button>
                                <button type="button" class="btn btn-sm btn-default" onclick="writeTextToCanvas(0, -5);"><span class="glyphicon glyphicon-chevron-up"></span></button>
                                <button type="button" class="btn btn-sm btn-default" onclick="writeTextToCanvas(5, 0);"><span class="glyphicon glyphicon-chevron-right"></span></button>
                                <button type="button" class="btn btn-sm btn-default" onclick="writeTextToCanvas(0, 5);"><span class="glyphicon glyphicon-chevron-down"></span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" id="saveTextElementButton" class="btn btn-primary" data-dismiss="modal" disabled="">Save text element</button>
                </div>
            </div>
        </div>
    </div>
    <div id="recordAudioOrVideoElement" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Enregistrer un élément audio/vidéo</h4>
                </div>
                <div class="modal-body">
                    <div id="chooseRecordButtons">
                        <button type="button" onclick="chooseVideoRecord();" id="chooseVideoButton" class="btn btn-block btn-lg btn-default">VIDEO</button>
                        <button type="button" onclick="chooseAudioRecord();" id="chooseAudioButton" class="btn btn-block btn-lg btn-default">AUDIO</button>
                    </div>
                    <div id="videoRecord" style="display: none;">
                        <button type="button" onclick="" id="recordVideoButton" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-record"></span></button>
                        <button type="button" onclick="" id="playPauseRecordVideoButton" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-play"></span></button>
                        <button type="button" onclick="" id="stopRecordVideoButton" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-stop"></span></button>
                    </div>
                    <div id="audioRecord" style="display: none;">
                        <button type="button" onclick="" id="playRecordAudioButton" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-play"></span></button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" onclick="" id="saveRecordButton" class="btn btn-primary" data-dismiss="modal" style="display: none;" disabled="">Save record</button>
                </div>
            </div>
        </div>
    </div>
    <div id="loadingDivConvert" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="progress progress-striped active">
                        <div class="progress-bar" id="progressRender"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                            <span class="sr-only">100% Complete</span>
                        </div>
                    </div>
                    <span id="renderText" class="marginauto"></span>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="js/jquery-latest.js"></script>
<script src="js/jquery.noty.packaged.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/index.js"></script>
<script src="js/Project.js"></script>
<script src="js/FileList.js"></script>
<script src="js/Element.js"></script>
<script src="js/Track.js"></script>
<script src="js/TextElement.js"></script>
<script src="js/Render.js"></script>
<script src="js/readProject.js"></script>
<script src="js/GenerateFileProject.js"></script>
<script src="js/lib/terminal.js"></script>

<script type="text/javascript">
    window.onload = function()
    {
        $('#startLoadingJS').modal('show');

        var OAjax;

        if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
        else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');

        OAjax.open('GET', 'js/lib/ffmpeg.js');

        OAjax.onprogress = function(e)
        {
            console.log(e.loaded);

            var persent = Math.ceil((e.loaded/27547136)*100) + '%';

            document.getElementById('downloadJSProgress').style.width = persent;
            document.getElementById('persentProgress').innerHTML = persent;
        }

        OAjax.onloadend = function(e)
        {
            console.log('end '+e.loaded);

            document.getElementById('loadingProgressProject').style.display = 'none';
            document.getElementById('startUseProject').style.display = '';
            document.getElementById('startUseProject').setAttribute("onclick", "openProject()");

            currentProject = new Project('undefined', getCurrentDate());
            updateTextProject();
        }

        OAjax.send();
    }
</script>
</body>
</html>