<?php
session_start();

$_SESSION['user'] = 'User'; ?>

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
        <nav class="navbar navbar-default" role="navigation">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Editor</a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Project <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="#" onclick="newProjectModal(true);">New project</a></li>
                                <li><a href="#" onclick="openProject();">Open project</a></li>
                                <li class="divider"></li>
                                <li><a href="#" onclick="saveProject();">Save project</a></li>
                                <li class="divider"></li>
                                <li><a href="#" id="projectDropdown">Project : No project</a></li>
                                <li><a href="#" id="lastSaveDropdown">Last save : None</a></li>
                            </ul>
                        </li>
                        <li><a href="#" onclick="addTrack();">New track</a></li>
                        <li><a href="#" onclick="makeRender();">Render</a></li>
                    </ul>
                    <form class="navbar-form navbar-left">
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-btn">
                                    <button type="button" onclick="zoomMoins();" class="btn btn-default"><span class="glyphicon glyphicon-zoom-out"></span></button>
                                </span>
                                <input  class="form-control" type="range" id="zoomRange" step="1" onchange="changeZoom(this.value);" style="display: inline-block; width: 150px;" name="zoom" min="1" value="5" max="10">
                                <span class="input-group-btn">
                                    <button type="button" onclick="zoomPlus();" class="btn btn-default"><span class="glyphicon glyphicon-zoom-in"></span></button>
                                </span>
                            </div>
                        </div>
                    </form>
                    <button class="btn btn-default navbar-btn" id="btnResize" onclick="activeResize();"><span class="glyphicon glyphicon-resize-small"></span></button>
                    <button onclick="saveProject();" class="btn btn-primary navbar-btn navbar-right"><span class="glyphicon glyphicon-save"></span></button>
                    <p class="navbar-text navbar-right" id="currentProject">No project</p>
                </div>
            </div>
        </nav>
        <div id="globalEdit">
            <div class="col-md-9 chronologicalView" id="offsetBlank">
                <div class="timeTrack">
                    <span class="timeLeft" id="startTime">0h0m0s</span>
                    <span class="timeRight" id="endTime">0h2m40s</span>
                </div>
                <div id="tracks"></div>
                <div id="VideoView" onscroll="scroolAllTracks();" class="videoViewEditor"></div>
            </div>
            <div class="col-md-2 filesList">
                <div id="listFiles" class="list-group listFiles">Aucun élément.</div>
                <div class="toolbar">
                    <hr>
                    <button type="button" class="btn btn-default" onclick="$('#fileLoader').click();"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-file"></span></button>
                    <button type="button" class="btn btn-default" onclick="newTextElement();"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-text-width"></span></button>
                    <button type="button" class="btn btn-default" onclick="newRecord();"><span class="glyphicon glyphicon-record"></span></button>
                    <button type="button" class="btn btn-block btn-danger" onclick="currentProject.stopAddFileTrack();" style="margin-top: 5px;display: none;" id="stopAddFileTrackButton">STOP</button>
                    <div style="display: none;"><input type="file" onchange="addFile();" id="fileLoader"/></div>
                </div>
            </div>
        </div>
    </div>
    <div id="filePropertiesModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Informations & options</h4>
                </div>
                <div class="modal-body">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <h3 class="panel-title" id="FileListName">Undefined</h3>
                        </div>
                        <div class="panel-body">
                            Taille: <span id="FileListSize"></span><br/>
                            Format: <span id="FileListFormat"></span><br/>
                            Durée: <span id="FileListDuration"></span><br/>
                            Aperçu: <span id="FileListPreview" style="width: 100px;height: 100px;"></span>
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
    <div id="loadModal" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
    <div id="startLoadingEditor" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Bienvenue sur VideoEditorJS</h4>
                </div>
                <div class="modal-body">
                    <p>Découvrez un univers en ligne pour monter vos vidéos.</p>
                    <hr>
                    <div id="loadingProgressProject">
                        <div class="progress progress-striped active">
                            <div id="progressLoadJS" class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                <span class="sr-only">0% Complete</span>
                            </div>
                        </div>
                        <span class="marginauto strong">Chargement en cours ... <span id="persentProgress">0%</span></span>
                    </div>
                    <div id="startUseProject" style="display: none;">
                        <h2>Projects</h2>
                        <h4>Existing</h4>
                        <div id="listExistingProjects">Loading existing projects ...</div>
                        <h4>New</h4>
                        <a href="#" onclick="newProjectModal(true);" class="btn btn-primary" data-dismiss="modal">New Project</a>
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
    <div id="textElementModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Ajouter un élément texte</h4>
                </div>
                <div class="modal-body">
                    <nav class="navbar navbar-default" role="navigation">
                        <div class="container-fluid">
                            <div class="navbar-header">
                                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                                    <span class="sr-only">Toggle navigation</span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                </button>
                                <a class="navbar-brand" href="#">Text Element</a>
                            </div>
                            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul class="nav navbar-nav">
                                    <form class="navbar-form navbar-left" role="search">
                                        <div class="form-group">
                                            <input class="form-control" onkeyup="currentManageTextElement.changeNameText(this.value);" id="nameText" type="text" placeHolder="Name">
                                        </div>
                                    </form>
                                    <li class="dropdown">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Font <span class="caret"></span></a>
                                        <ul class="dropdown-menu" role="menu">
                                            <li id="buttonFont0" class="active"><a href="#" onclick="currentManageTextElement.changeFont('Calibri', 0);">Calibri</a></li>
                                            <li id="buttonFont1"><a href="#" onclick="currentManageTextElement.changeFont('Times New Roman', 1);">Times New Roman</a></li>
                                            <li id="buttonFont2"><a href="#" onclick="currentManageTextElement.changeFont('Arial', 2);">Arial</a></li>
                                            <li id="buttonFont3"><a href="#" onclick="currentManageTextElement.changeFont('Verdana', 3);">Verdana</a></li>
                                        </ul>
                                    </li>
                                    <li class="dropdown">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Size <span class="caret"></span></a>
                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="#"><span id="sizeTextInfo"></span>px</a></li>
                                            <li><a href="#"><input class="form-control" min="10" max="100" step="2" onchange="currentManageTextElement.changeSizeText(this.value);" id="sizeText" type="range"></a></li>
                                        </ul>
                                    </li>
                                    <li class="dropdown">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Color <span class="caret"></span></a>
                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="#"><input class="form-control" onchange="currentManageTextElement.changeColor(this.value);" id="colorText" type="color"></a></li>
                                        </ul>
                                    </li>
                                    <li class="dropdown">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Align <span class="caret"></span></a>
                                        <ul class="dropdown-menu" role="menu">
                                            <li id="buttonTextAlign0" class="active"><a href="#" onclick="currentManageTextElement.changeTextAlign('center', 0);">Center</a></li>
                                            <li id="buttonTextAlign1"><a href="#" onclick="currentManageTextElement.changeTextAlign('left', 1);">Left</a></li>
                                            <li id="buttonTextAlign2"><a href="#" onclick="currentManageTextElement.changeTextAlign('right', 2);">Right</a></li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul class="nav navbar-nav navbar-right">
                                    <button type="button" onclick="saveTextElement();" id="buttonSaveTextElement" class="btn btn-success navbar-btn" disabled="">Save</button>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <canvas id="textElement"></canvas>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
<script src="js/loadEditor.js"></script>

<div id="loadScript"></div>

<!--
<script src="js/index.js"></script>
<script src="js/onEvent.js"></script>
<script src="js/class/Project.js"></script>
<script src="js/class/FileList.js"></script>
<script src="js/class/ManageTextElement.js"></script>
<script src="js/class/TextElement.js"></script>
<script src="js/Element.js"></script>
<script src="js/Track.js"></script>
<script src="js/Render.js"></script>
<script src="js/readProject.js"></script>
<script src="js/GenerateFileProject.js"></script>
<script src="js/lib/terminal.js"></script>
-->

<!--
<script type="text/javascript">
    window.onload = function() {
        $('#startLoadingJS').modal('show');

        currentProject = new Project('undefined', getCurrentDate());
        currentManageTextElement = new ManageTextElement(0, 'textElement', 855, {nameText : 'nameText', sizeText : 'sizeText', sizeTextInfo : 'sizeTextInfo', colorText : 'colorText', buttonSaveTextElement : 'buttonSaveTextElement'});

        var OAjax;

        if (window.XMLHttpRequest) OAjax = new XMLHttpRequest();
        else if (window.ActiveXObject) OAjax = new ActiveXObject('Microsoft.XMLHTTP');

        OAjax.open('GET', 'js/lib/ffmpeg.js');

        OAjax.onprogress = function(e)
        {
            var persent = Math.ceil((e.loaded/27547136)*100) + '%';

            document.getElementById('downloadJSProgress').style.width = persent;
            document.getElementById('persentProgress').innerHTML = persent;
        };

        OAjax.onloadend = function(e)
        {
            document.getElementById('loadingProgressProject').style.display = 'none';
            document.getElementById('startUseProject').style.display = '';

            currentProject.isStarted = true;

            updateTextProject();
        };

        OAjax.send();
    }
</script>
-->
</body>
</html>