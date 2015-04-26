var tabFilesJS = [
    'index.js',
    'class/Project.js',
    'class/ReadFileProject.js',
    'class/GenerateFileProject.js',
    'class/File.js',
    'class/FileUpload.js',
    'class/ManageTextElement.js',
    'class/TextElement.js',
    'class/Track.js',
    'class/Element.js',
    'class/RenderProject.js',
    'lib/TerminalJs/TerminalJs.js',
    'manage/mProjects.js',
    'manage/mFiles.js',
    'manage/mTextElement.js',
    'manage/mTracks.js',
    'manage/mTracksCanvas.js',
    'manage/mElements.js',
    'manage/mRecords.js',
    'manage/mRender.js',
    'manage/mErrors.js',
    'lib/waveform/wavesurfer.js',
    'lib/waveform/util.js',
    'lib/waveform/webaudio.js',
    'lib/waveform/drawer.js',
    'lib/waveform/drawer.canvas.js',
    'onEvent.js'
];

var currentFileRow = 0;

var currentProject = false, currentManageTextElement = false;

var usernameSession;

var remoteAPIPath = 'http://clangue.net/other/testVideo/';

var readFileProject = false;



//events
//var listfilesend = new Event('listfilesend');
//var classend = new Event('classend');

var lastRLog = '';

var imageClose = new Image();

imageClose.onload = function() {
    console.log('loaded close');
};

imageClose.src = 'http://clangue.net/other/testVideo/img/remove.png';

window.onload = function() {
    $('#startLoadingEditor').modal('show');

    var timeCanvas = document.getElementById('timeBarCanvas');
    timeCanvas.style.width='100%';
    timeCanvas.style.height='100%';
    timeCanvas.width = timeCanvas.offsetWidth;
    timeCanvas.height = timeCanvas.offsetHeight;

    getFileJS();
};

function getFileJS() {
    if(currentFileRow != tabFilesJS.length)
    {
        console.log('load file : ' + tabFilesJS[currentFileRow]);

        loadFileJS('js/' + tabFilesJS[currentFileRow], function() {
            getFileJS();
        });

        currentFileRow++;

        document.getElementById('progressLoadJS').style.width = Math.ceil((currentFileRow / tabFilesJS.length) * 100) + '%';
        document.getElementById('persentProgress').innerHTML = currentFileRow + '/' + tabFilesJS.length;
    }
    else
    {
        console.log('finish load JS');

        terminal = new Terminal();
        currentManageTextElement = new ManageTextElement(0, 'textElement', 855, {nameText : 'nameText', sizeText : 'sizeText', sizeTextInfo : 'sizeTextInfo', colorText : 'colorText', buttonSaveTextElement : 'buttonSaveTextElement', textArea : 'textTextElement'});

        console.log('initialed classes');

        document.getElementById('loadingProgressProject').style.display = 'none';

        if(availableBrowser())
        {
            document.getElementById('enterUsername').style.display = 'initial';
        }
        else
        {
            document.getElementById('notAvailableBrowser').style.display = 'initial';
        }
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

function setUsername(username) {
    if(username != '')
    {
        usernameSession = username.deleteAccent().replace(' ', '_').toUpperCase();

        document.getElementById('enterUsername').style.display = 'none';
        document.getElementById('startUseProject').style.display = '';

        getListProjects('listExistingProjects', usernameSession);
    }
    else
    {
        noty({layout: 'topRight', type: 'error', text: 'Erreur, veuillez entrer un pseudo.', timeout: '5000'});
    }
}