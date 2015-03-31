#!/bin/bash
#define all path ans vars that are usefull
DATAPATH="/home/clangue/VEJSFiles"
LOGPATH="/home/clangue/videoProcess/logs"
TEMPDIR="/home/clangue/videoProcess/tmp"
SAMPLEDIR="/home/clangue/videoProcess/sample"
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
        SERVATT=$(find . -name "*.ffm" | wc -l)
        VALUE="action=setStat&content={\"wait\":$SERVATT}"
        echo "updating Stat"
        wget -O /dev/null "http://clangue.net/other/testVideo/php/renderStat.php?$VALUE"

        rm $TEMPDIR/*
        DIR=$(dirname "${ffm}")
        ID=$(echo $DIR | sed -r 's/^.{2}//' | tr '[/]' '_')
        echo "dir :$DIR"
        echo "id : $ID"
        cd "$DIR"
        cp $SAMPLEDIR/* $TEMPDIR
        cp * $TEMPDIR
        cd $TEMPDIR
        echo $(pwd)
        DATE=$(date +"%T %d-%m-%Y")
        AV=1
        LN=$(wc -l < "RENDER.ffm")
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
            wget -O /dev/null "http://clangue.net/other/testVideo/php/renderStat.php?$VALUE"
            AV=$(($AV+1))
        done < "RENDER.ffm"
        cd $DATAPATH
        cd "$DIR"
        mv "RENDER.ffm" "RENDER.ok"
        cd $DATAPATH
    done < "$LOGPATH/renderList.txt"
    sleep 10
done