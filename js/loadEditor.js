var tabFilesJS = [
    'index.js',
    'class/Project.js',
    'class/ReadProject.js',
    'class/GenerateFileProject.js',
    'class/FileList.js',
    'class/ManageTextElement.js',
    'class/TextElement.js',
    'class/Track.js',
    'class/Element.js',
    'class/Render.js',
    'lib/terminal.js',
    'lib/ffmpeg.js',
    'onEvent.js'
];

var currentFileRow = 0;

var currentProject, currentManageTextElement;

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

        console.log(Math.ceil((currentFileRow / tabFilesJS.length) * 100));

        document.getElementById('progressLoadJS').style.width = Math.ceil((currentFileRow / tabFilesJS.length) * 100) + '%';
        document.getElementById('persentProgress').innerHTML = currentFileRow + '/' + tabFilesJS.length;
    }
    else
    {
        console.log('endLoadFileJS');

        currentProject = new Project('undefined', getCurrentDate());
        currentProject.isStarted = true;

        currentManageTextElement = new ManageTextElement(0, 'textElement', 855, {nameText : 'nameText', sizeText : 'sizeText', sizeTextInfo : 'sizeTextInfo', colorText : 'colorText', buttonSaveTextElement : 'buttonSaveTextElement'});

        document.getElementById('loadingProgressProject').style.display = 'none';
        document.getElementById('startUseProject').style.display = '';

        getListProjects('listExistingProjects');

        updateTextProject();
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

    document.getElementById('loadScript').appendChild(script);
};