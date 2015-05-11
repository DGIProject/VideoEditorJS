window.onload = function() {
	getCommits();
};

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

function getCommits() {
	var id = 0;
	var url = 'https://api.github.com/repos/DGIProject/VideoEditorJS/commits?per_page=500&access_token=b4b78df4cb1818a3ec33ad7449f5c0496dd2d1e3';

    var xhr = createCORSRequest('GET', url);

    if (!xhr) {
		console.log('no xhr');
		return;
    }

    xhr.onload = function() {
        //console.log('response : ' + xhr.responseText);
		
		var tabCommits = JSON.parse(xhr.responseText);
		
		for(var i = 0; i < tabCommits.length; i++) {
			if(id == 0) {
				document.getElementById('githubCommits').innerHTML = '';
			}
			
			var commit = document.createElement('div');
			commit.setAttribute('class', 'bs-callout bs-callout-info');
			commit.innerHTML = '<h4>' + tabCommits[i].commit.message + '</h4><p><ul id="filesCommit' + id + '"></ul>' + tabCommits[i].commit.author.name + ' - ' + tabCommits[i].commit.author.date + '</p>';
			
			document.getElementById('githubCommits').appendChild(commit);
			
			infoFiles(id, tabCommits[i].url + '?access_token=b4b78df4cb1818a3ec33ad7449f5c0496dd2d1e3');
			
			id++;
		}
	};

    xhr.onerror = function() {
		console.log('error');
    };

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send();
}

function infoFiles(id, url) {
	var xhr = createCORSRequest('GET', url);

    if (!xhr) {
		console.log('no xhr');
		return;
    }

    xhr.onload = function() {
        //console.log('response : ' + xhr.responseText);
		
		var tabCommit = JSON.parse(xhr.responseText);
		
		for(var i = 0; i < tabCommit.files.length; i++) {
			var file = document.createElement('li');
			file.innerHTML = '<a href="' + tabCommit.files[i].blob_url + '?access_token=b4b78df4cb1818a3ec33ad7449f5c0496dd2d1e3" target="_blank">' + tabCommit.files[i].filename + '</a>';
			
			document.getElementById('filesCommit' + id).appendChild(file);
		}
	};

    xhr.onerror = function() {
		console.log('error');
    };

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send();
}