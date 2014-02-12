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
    <div id="loadingDiv"><div class="loader2"></div><span>Chargement en cours ...</span></div>
    <div class="col-md-10 col-md-offset-1">
        <h1>VideoEditorJS</h1>
        <div id="editor" class="well">
            <div class="toolbar">
                <button class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-facetime-video"></span></button>
                <button class="btn btn-default">Cut</button>
                <button class="btn btn-default">Render & save </button>
                <button onclick="New()" class="btn btn-default">New...</button>
                <button onclick="addTrack();" class="btn btn-default">New track</button>
                <button data-toggle="modal" data-target="#addFileTrackModal" class="btn btn-default">Videothèque</button>
                <a href="#" onclick="zoomMoin()"><span class="glyphicon glyphicon-zoom-out" ></span></a>
                <input type="range" id="zoomRange" step="1" onchange="changeZoom(this.value)" style="display: inline-block; width: 150px;" name="zoom" min="1" value="5" max="10">
                <a href="#" onclick="zoomPlus()"><span class="glyphicon glyphicon-zoom-in"></span></a>
            </div>
            </br>
            <div class="content">
                <div class="chronologicalView pre">
                    <div class="timeTrack">
                        <span class="timeLeft" id="startTime">0s</span>
                        <span class="timeRight" id="endTime">2m40s</span>
                    </div>
                    <div id="tracks"></div>
                    <div id="VideoView" onscroll="scroolAllTracks();" class="videoViewEditor"></div>
                </div>

                <div class="player pre">
                    <div id="contentPlayer"></div>
                <span>
                    <div id="timeStart" class="time">00:00</div>
                        <div id="progressPlayerOuter" class="progress">
                            <div id="progressPlayer" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
                                <span class="sr-only">60% Complete</span>
                            </div>
                        </div>
                    <div id="timeEnd" class="time">00:00</div>
                </span>
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
                                <span>List des fichiers multimédias</span>
                                <div class="toolbar">
                                    <button class="btn-default btn-xs btn" onclick="$('#fileLoader').click();"><span class="glyphicon glyphicon-plus"></span></button> <button onclick="removeFileFromList()" class="btn btn-default btn-xs "><span class="glyphicon glyphicon-minus"></span></button>
                                    <hr/>
                                    <div style="display: none;"><input type="file" onchange="addOneFile()" id="fileLoader"/></div>
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
</div>

<script src="https://code.jquery.com/jquery.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/index.js"></script>
<script src="js/FileList.js"></script>
<script src="js/Elements.js"></script>
<script src="js/lib/terminal.js"></script>
</body>
</html>