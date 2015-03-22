function loadM() {
    eId('progressionBar').style.width = '100%';
    eId('progressionStatus').innerHTML = 'Chargement en cours ...';

    $('#loadModal').modal('toggle');
}

function eId(id) {
    return document.getElementById(id);
}

function rLog(text) {
    if(text != lastRLog)
    {
        eId('console').innerHTML += '</br>' + text;
    }

    lastRLog = text;
}

function compressName(name) {
    return ((name.length > 12) ? name.substring(0, 4) + '...' + name.substring(name.length - 5, name.length) : name);
}

function rowById(id, tab)
{
    var row = -1;

    for(var i = 0; i < tab.length; i++)
    {
        if(tab[i].id == id)
        {
            row = i;
        }
    }

    return row;
}

function timeToSeconds(time) {
    var timeSplit = time.split(':');

    return (parseInt(timeSplit[0]) * 3600) + (parseInt(timeSplit[1] * 60)) + parseInt(timeSplit[2].split('.')[0]);
}

function getCurrentDate() {
    var date = new Date();

    var dayOfMonth = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    var month = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);

    var hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    var minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    var second = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();

    return dayOfMonth + '/' + month + '/' + date.getFullYear() + ' ' + hour + ':' + minute + ':' + second;
}

function getHour() {
    var date = new Date();

    var hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    var minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    var second = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();

    return hour + ':' + minute + ':' + second;
}

function availableBrowser() {
    return navigator.userAgent.indexOf('Firefox') > 0;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function randomColor() {
    return '#' + (function co(lor){   return (lor +=
        [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
    && (lor.length == 6) ?  lor : co(lor); })('');
}

function xmlHTTP() {
    return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

Array.prototype.remove = function(from, to) { var rest = this.slice((to || from) + 1 || this.length); this.length = from < 0 ? this.length + from : from; return this.push.apply(this, rest); };

String.prototype.deleteAccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
};

function findFirstDescendant(parent, tagname)
{
    parent = document.getElementById(parent);
    var descendants = parent.getElementsByTagName(tagname);
    if ( descendants.length )
        return descendants[0];
    return null;
}