var tabFilesJS = [
    'index.js',
    'canvasTrack.js',
    'class/Project.js',
    'class/ReadProject.js',
    'class/GenerateFileProject.js',
    'class/File.js',
    'class/ManageTextElement.js',
    'class/TextElement.js',
    'class/Track.js',
    'class/Element.js',
    'class/Render.js',
    'class/videoRecorder.js',
    'class/TerminalJs.js',
    'lib/terminal.js',
    //'lib/ffmpeg-all-codecs.js',
    'onEvent.js'
];

var currentFileRow = 0;

var currentProject = false, currentManageTextElement = false;

window.onload = function() {
    console.log('onload');

    $('#startLoadingEditor').modal('show');

    getFileJS();
};

function getFileJS() {
    if(currentFileRow != tabFilesJS.length)
    {
        console.log('getFileJS : ' + tabFilesJS[currentFileRow]);

        loadFileJS('js/' + tabFilesJS[currentFileRow], function() {
            getFileJS();
        });

        currentFileRow++;

        document.getElementById('progressLoadJS').style.width = Math.ceil((currentFileRow / tabFilesJS.length) * 100) + '%';
        document.getElementById('persentProgress').innerHTML = currentFileRow + '/' + tabFilesJS.length;
    }
    else
    {
        console.log('endLoadFileJS');
        console.log("init");

        // initWorker();

        terminal = new Terminal();

        console.log('inited');

        currentManageTextElement = new ManageTextElement(0, 'textElement', 855, {nameText : 'nameText', sizeText : 'sizeText', sizeTextInfo : 'sizeTextInfo', colorText : 'colorText', buttonSaveTextElement : 'buttonSaveTextElement'});

        document.getElementById('loadingProgressProject').style.display = 'none';
        document.getElementById('startUseProject').style.display = '';

        getListProjects('listExistingProjects');
    }
}

function loadFileJS(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';

    script.src = url;

    if (callback) {
        script.onreadystatechange = callback;
        script.onload = script.onreadystatechange;
        script.onprogress = function(e) {
            console.log(e.loaded);
        }
    }

    document.getElementById('loadScripts').appendChild(script);
}