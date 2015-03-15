window.onload = function (e) {
    calculateTimeBar();
};

window.onbeforeunload = function (e) {
    e = e || window.event;

    saveProject();

    if(currentProject.currentUploads > 0)
    {
        var msg = 'Envoi en cours des fichier, ne fermez pas encore la fenêtre ou tout sera perdu.';

        // For IE and Firefox
        if (e) {e.returnValue = msg;}

        // For Chrome and Safari
        return msg;
    }
};

function loadM() {
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

function randomColor() {
    return '#' + (function co(lor){   return (lor +=
        [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
    && (lor.length == 6) ?  lor : co(lor); })('');
}

function xmlHTTP() {
    return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
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