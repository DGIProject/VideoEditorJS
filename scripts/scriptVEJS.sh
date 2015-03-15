#!/bin/bash

	ncftpls -u admin@clangue.net -p chateauroux -x "nlist" ftp://ftp.online.net/www/testVideo/data/CommandFile |  sed '/^$/d' | sed '1,1d'  > /home/clangue/www/testvideo/ftpFileList.txt
	while read line; do 
		echo $line # or whaterver you want to do with the $line variable
		ncftpget -u admin@clangue.net -p chateauroux ftp://ftp.online.net/www/testVideo/data/CommandFile/$line
		while read name; do
			#echo $name	
			#echo "./ffmpeg $name"
			./ffmpeg $name < /dev/null
		done < /home/clangue/www/testvideo/$line
	done < /home/clangue/www/testvideo/ftpFileList.txt
