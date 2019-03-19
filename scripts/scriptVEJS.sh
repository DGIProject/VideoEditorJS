#!/bin/bash
#define all path ans vars that are usefull
DATAPATH="/c/xampp/htdocs/test/samples/VEJSFiles"
LOGPATH="/c/xampp/htdocs/test/samples/videoProcess/logs"
TEMPDIR="/c/xampp/htdocs/test/samples/videoProcess/tmp"
WEBSERVPHPDir="localhost"
FFMPEGPATH="ffmpeg"
THREADS=4

verify="bob"
while [ "$verify" != jack ]
do
    #Going into the directory with projects data
    #rm $TEMPDIR/*
    cd $DATAPATH
    #List all ffm files to a txt file
    find . -name "*.ffm" > "$LOGPATH/renderList.txt"
    while read ffm; do
        #echo $ffm
        rm $TEMPDIR/*
        DIR=$(dirname "${ffm}")
        ID=$(echo $DIR | sed -r 's/^.{2}//' | tr '[/]' '_')
        echo "dir :$DIR"
        echo "id : $ID"
        cd "$DIR"
		mkdir "RENDER_DATA"
        cp * $TEMPDIR
        cd $TEMPDIR
        echo $(pwd)
        DATE=$(date +"%T %d-%m-%Y")
        AV=1
        LN=$(($(wc -l < "RENDER.ffm")+1))
    #    echo "action=update&id=$ID&content={totcmd:$LN,actual:$AV,startTime:$DATE}"
    #    sleep 1
        while read content; do
            echo "ffmepg start"
            echo $content
            ARGS=($content)
            sleep 1
            echo | eval "$FFMPEGPATH -threads $THREADS $content"
            echo "ffmpeg end"
            VALUE="action=update&id=$ID&content={\"totcmd\":$LN,\"actual\":$AV,\"startTime\":\"$DATE\"}"
            echo "updating Stat"
            wget -O /dev/null "$WEBSERVPHPDir/renderStat.php?$VALUE"
            AV=$(($AV+1))
        done < "RENDER.ffm"
	cd $DATAPATH
	cd "$DIR"
	mv "RENDER.ffm" "RENDER.ok"
	cd "RENDER_DATA"
	FILENAME=$(ls $TEMPDIR | grep "final\.");
	CURDATE=$(date +%s)
	cp $TEMPDIR/$FILENAME  "$CURDATE.${FILENAME##*.}"
    cp $TEMPDIR/$FILENAME  "$CURDATE.${FILENAME##*.}"
    FILENAME=$(ls $TEMPDIR | grep "final_WEB\.*");
    cp $TEMPDIR/$FILENAME  "$CURDATE_WEB.${FILENAME##*.}"
    cp $TEMPDIR/$FILENAME  "$CURDATE_WEB.${FILENAME##*.}"
	VALUE="action=update&id=$ID&content={\"totcmd\":$LN,\"actual\":$AV,\"startTime\":\"$DATE\", \"filename\":\"$CURDATE.${FILENAME##*.}\"}"
    echo "updating Stat"
    wget -O /dev/null "$WEBSERVPHPDir/renderStat.php?$VALUE"
	cd $DATAPATH
    SERVATT=$(find . -name "*.ffm" | wc -l)
    VALUE="action=setStat&content={\"wait\":$SERVATT}"
	echo "updating Stat"
	wget -O /dev/null "$WEBSERVPHPDir/renderStat.php?$VALUE"
	done < "$LOGPATH/renderList.txt"
    sleep 10
done
