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
        <div class="editor well">
            <div class="toolbar">
                <button class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> <span class="glyphicon glyphicon-facetime-video"></span></button>
                <button class="btn btn-default">Cut</button>
                <button class="btn btn-default">Render & save </button>
                <button onclick="New()" class="btn btn-default">New...</button>
                <button onclick="addTrack();" class="btn btn-default">New track</button>
                <a href="#"><span class="glyphicon glyphicon-zoom-out" ></span></a>
                <input type="range" style="display: inline-block; width: 150px;" name="zoom" min="1" max="10">
                <a href="#"><span class="glyphicon glyphicon-zoom-in"></span></a>


            </div>
            </br>
            <div>
                <span class="player">
                    <div id="timeStart" class="time">00:00</div>
                    <div id="progressPlayerOuter" class="progress">
                        <div id="progressPlayer" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
                            <span class="sr-only">60% Complete</span>
                        </div>
                    </div>
                    <div id="timeEnd" class="time">00:00</div>
                </span>
            </div>
            </br>
            <div class="chronologicalView">
                <div id="tracks">
                    <div id="track1" class="singleTrack">
                        <div class="valuesTrack">
                            <input type="text" onkeypress="updateNameTrack(1, this.value);" class="form-control">
                            <input type="range" onchange="updateVolumeTrack(1, this.value);">
                        </div>
                        <div class="optionsTrack">
                            <button type="button" onclick="settingsTrack(1);" class="btn btn-link" data-toggle="modal" data-target="#addFileTrackModal"><span class="glyphicon glyphicon-plus"></span></button>
                            <button type="button" onclick="settingsTrack(1);" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button>
                            <button type="button" onclick="deleteTrack(1);" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button>
                        </div>
                    </div>
                </div>

                <div id="VideoView" onscroll="scroolAllTracks();" class="videoViewEditor">
                    <div id="ViewTrack1" class="singleTrack">
                        <p class="textViewEditor">Vous n'avez séléctionné aucune vidéo.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="addFileTrackModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Modal title</h4>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/index.js"></script>
</body>
</html>