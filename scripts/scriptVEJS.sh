#!/bin/bash
#define all path ans vars that are usefull
DATAPATH="/home/clangue/VEJSFiles"
LOGPATH="/home/clangue/videoProcess/logs"
TEMPDIR="/home/clangue/videoProcess/tmp"
SAMPLEDIR="/home/clangue/videoProcess/sample"
THREADS_NUMBER=4
#going into the directory with projects data
#rm $TEMPDIR/*
cd $DATAPATH
#List all ffm files to a txt file
find . -name "*.ffm" > "$LOGPATH/renderList.txt"
while read ffm; do
    #echo $ffm
    rm $TEMPDIR/*
    DIR=$(dirname "${ffm}")
    echo $DIR
    cd "$DIR"
    cp $SAMPLEDIR/* $TEMPDIR
    cp * $TEMPDIR
    cd $TEMPDIR
    while read content; do
        # echo $content
        ffmpeg -threads $THREADS_NUMBER  $content
    done < "RENDER.ffm"
    cd $DATAPATH
done < "$LOGPATH/renderList.txt"