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

var usernameSession = null, tabTranslations = null;

var remoteAPIPath = 'http://clangue.net/other/testVideo/';

var readFileProject = false;

var pressedKey = -1;

var lastRLog = '';

var imageClose = new Image();

imageClose.onload = function() {
    console.log('loaded close');
};

imageClose.src = 'http://clangue.net/other/testVideo/img/remove.png';

window.onload = function() {
    $('#startLoadingEditor').modal('show');

    getFileJS();
    loadTranslation('fr');
};

function loadTranslation(fileName) {
    var xhr = xmlHTTP();

    xhr.open("GET", 'translations/' + fileName + '.lang', false);
    xhr.send(null);
    if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
        throw new Error("Impossible de charger le fichier de traduction \"" + fileName + ".lang\" (code HTTP : " + xhr.status + ").");

    tabTranslations = JSON.parse(xhr.responseText);

    for(var i = 0; i < tabTranslations.translations.length; i++) {
        if(document.getElementById(tabTranslations.translations[i].id) != null)
            document.getElementById(tabTranslations.translations[i].id).innerHTML = tabTranslations.translations[i].text;
    }
}

function getTranslation(id) {
    var translation = 'ERROR_TRANSLATION';

    for(var i = 0; i < tabTranslations.translations.length; i++) {
        if(tabTranslations.translations[i].id == id)
            translation = tabTranslations.translations[i].text;
    }

    if(translation == 'ERROR_TRANSLATION')
        reportError('ERROR_TRANSLATION [id: ' + id + ']');

    return translation;
}

function getFileJS() {
    if(currentFileRow != tabFilesJS.length)
    {
        console.log('load file : ' + tabFilesJS[currentFileRow]);

        loadFileJS('js/' + tabFilesJS[currentFileRow], function() {
            getFileJS();
        });

        currentFileRow++;

        document.getElementById('progressLoadJS').style.width = Math.ceil((currentFileRow / tabFilesJS.length) * 100) + '%';
        document.getElementById('percentProgress').innerHTML = currentFileRow + '/' + tabFilesJS.length;
    }
    else
    {
        console.log('finish load JS');

        loadTimeBar();

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

function xmlHTTP() {
    return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
}