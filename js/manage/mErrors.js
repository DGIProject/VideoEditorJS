/**
 * Created by Dylan on 10/02/2015.
 */

function reportError(text) {
    var url = config.apiPath + 'php/reportError.php';

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
        noty({layout: 'topRight', type: 'error', text: 'Erreur, navigateur incompatible avec les requêtes CORS.', timeout: '5000'});
        return;
    }

    xhr.onload = function() {
        console.log(xhr.responseText);
    };

    xhr.onerror = function() {
        noty({layout: 'topRight', type: 'error', text: 'Erreur, impossible de contacter le serveur.', timeout: '5000'});
    };

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send('text=' + ((isFirefox) ? '-Firefox-' : '-Chrome-') + ' -' + usernameSession + '- ' + ' -' + ((currentProject) ? currentProject.name : 'No Project') + '- ' + text);
}