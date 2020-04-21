VideoEditorJS
=============

VideoEditorJs is a small and easy to use Video Editor, online, made with Javascript and HTML, plus a server with a small script and ffmpeg.

How To install ? 
================

There are two ways to do that :
- The first one is to clone the depo with `git clone` on a webserver.
- The second one is to download the zip file.

### Installation

- Then Edit the php/config.php to change paths for files
- Then on the same server or another one, move the sample directory, and also the script directory
- Create directories that will be used for tempory data.
- Edit VEJSScript.sh and change paths.
- When you are ready, start the script with `./VEJSScript.sh`

## If the webserver and processing are not the same :

You will have to mount the webserver data directory into the directory you want to use for data storing.
if your webserver has an FTP server, you can use `curlftpfs` that allows you to mount an FTP server in a directory.

If you have another solution we are open to them ! Just contact us by github or by email !

## If the web server and processing server are the same :

Just change paths in scripts as described above. It is easy !

You can try this project on : http://clangue.net/other/testVideo/

Requirements
============

To work properly this project need some packages.
To use this project you nedd to have a webserver running for example apache or ngnx with php5.
The server can run as well for Linux servers or Widnows servers ( script comming soon ).
You also have to download ( for windows essentialy ) a staic version of FFmpeg binaries, adapted for your architecture can be found here http://ffmpeg.org/download.html.
To use it you need to have a recent web-browser. In particaly we recomand Firefox and Google Chrome.

Screen's :
=============
- Main Interface :
![alt tag](https://raw.githubusercontent.com/DGIProject/VideoEditorJS/master/screenshots/scr01.PNG)
- Renders page :
![alt tag](https://raw.githubusercontent.com/DGIProject/VideoEditorJS/master/screenshots/scr02.PNG)
- File properties :
![alt tag](https://raw.githubusercontent.com/DGIProject/VideoEditorJS/master/screenshots/scr03.PNG)
- HTML5 Audio/Video recording :
![alt tag](https://raw.githubusercontent.com/DGIProject/VideoEditorJS/master/screenshots/scr04.PNG)
- Upload manager :
![alt tag](https://raw.githubusercontent.com/DGIProject/VideoEditorJS/master/screenshots/scr05.png)
- Element properties :
![alt tag](https://raw.githubusercontent.com/DGIProject/VideoEditorJS/master/screenshots/scr06.png)
- Text element editor :
![alt tag](https://raw.githubusercontent.com/DGIProject/VideoEditorJS/master/screenshots/scr07.png)
