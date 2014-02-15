<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>VideoEditorJS</title>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
<div class="row">
    <div class="col-md-10 col-md-offset-1">
        <h1>VideoEditorJS</h1>
        <div id="editor" class="well">
            <div class="toolbar">
                <button onclick="newProject();" class="btn btn-default">New project</button>
                <button onclick="addTrack();" class="btn btn-default">New track</button>
                <button class="btn btn-default">Render & save </button>
                <button class="btn btn-default" id="btnResize" onclick="activeResize();"><span class="glyphicon glyphicon-resize-small"></span></button>
                <a href="#" onclick="zoomMoins();"><span class="glyphicon glyphicon-zoom-out" ></span></a>
                <input  class="form-control" type="range" id="zoomRange" step="1" onchange="changeZoom(this.value);" style="display: inline-block; width: 150px;" name="zoom" min="1" value="5" max="10">
                <a href="#" onclick="zoomPlus();"><span class="glyphicon glyphicon-zoom-in"></span></a>
            </div>
            </br>
            <div class="row">
                <div class="col-md-10 chronologicalView pre">
                    <div class="timeTrack">
                        <span class="timeLeft" id="startTime"></span>
                        <span class="timeRight" id="endTime"></span>
                    </div>
                    <div id="tracks"></div>
                    <div id="VideoView" onscroll="scroolAllTracks();" class="videoViewEditor"></div>
                </div>
                <div class="col-md-2 col-md-offset-1 filesList pre">
                    <span class="titleSize strong">Eléments</span>
                    </br>
                    <div class="toolbar">
                        <button type="button" class="btn btn-default" onclick="$('#fileLoader').click();"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-facetime-video"></span></button>
                        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#createTitle"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-text-width"></span></button>
                        <button type="button" class="btn btn-danger" onclick="stopAddFileToTrack();" style="display: none;" id="stopAddFileToTrackButton">STOP</button>
                        <hr/>
                        <div style="display: none;"><input type="file" onchange="addOneFile();" id="fileLoader"/></div>
                    </div>
                    <div id="listFilesLib" class="list-group listFilesLib"></div>
                </div>
            </div>
        </div>

    </div>
    <div id="addFileTrackModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Videothèque</h4>
                </div>
                <div class="modal-body">
                    <div class="well" style="height: 300px;">
                        <div class="row">
                            <div class="col-xs-6" style="text-align: center;">
                                <span>Liste des fichiers multimédias</span>
                                <div class="toolbar">
                                    <button class="btn-default btn-xs btn" onclick="$('#fileLoader').click();"><span class="glyphicon glyphicon-plus"></span></button> <button onclick="removeFileFromList()" class="btn btn-default btn-xs "><span class="glyphicon glyphicon-minus"></span></button>
                                    <hr/>
                                    <div style="display: none;"><input type="file" onchange="addOneFile();" id="fileLoader"/></div>
                                </div>
                                <div id="divListFile">
                                </div>
                            </div>
                            <div class="col-xs-6" style="text-align: center; height:250px ;border-left: 1px solid grey">
                                <div>
                                    <span>Information sur la sélection</span>
                                    <hr/>
                                </div>
                                <div>
                                    Nom: <span id="selectedFileName"></span><br/>
                                    Taille: <span id="selectedFileSize"></span><br/>
                                    Format: <span id="selectedFileFormat"></span><br/>
                                    Durée: <span id="selectedFileDuration"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="libSelectButton">Add to Track</button>
                </div>
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
                    <span class="center">Chargement en cours ...</span>
                </div>
            </div>
        </div>
    </div>
    <div id="createTitle" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Editeur de Titre</h4>
                </div>
                <div class="modal-body">

                        <div class="row">
                            <div class="col-xs-9" style="text-align: center;">
                            <canvas id="TitleRender" width="400px" height="300px" style="border: 1px solid #000000"></canvas>
                            <br/><button class="btn btn-default" onclick="context.clear()" >Clear</button>
                            </div>
                            <div class="col-xs-3" style="text-align: center; height:250px ;border-left: 1px solid grey">
                                <div>
                                    <span>Informations</span>
                                    <hr/>
                                </div>
                                <div>
                                    Name<input class="form-control" id="titleName" type="text" placeholder="NameOfYourTitle"/> <br/>
                                    Texte <input class="form-control" onkeyup="writeTextToCanvas(this.value)" type="text"/><br/>
                                    Couleur du texte<input class="form-control" id="colorText" type="color"/> <br/>
                                    Taille du texte<input id="txtSize" class="form-control" min="10" max="70" step="2" type="range"/> <br/>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" data-dismiss="modal" class="btn btn-primary" onclick="saveTitle()" id="saveTitle">Save Title</button>
                </div>
            </div>
        </div>
    </div>

</div>

<script src="https://code.jquery.com/jquery.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/index.js"></script>
<script src="js/FileList.js"></script>
<script src="js/Elements.js"></script>
<script src="js/track.js"></script>
<script src="js/lib/terminal.js"></script>
</body>
</html>