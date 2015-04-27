#!/bin/bash

function ftpTest {
    read -p "FTP Host" -r FHOST
    read -p "FTP Username"  -r FUSER
    read -p "FTP Password" -r -s FPASS
    echo "...CHECKING CONFIG...";
    echo "open $FHOST
    user $FUSER $FPASS
    bye" > test.ftp
    if [ $(ftp -n < test.ftp 2>&1 | grep -c 'unknown|refused') -eq 1 ]
    then
        echo "can't connect";
        read -p "Do you want retry ? " -n 1 -r
        if [[ ! $REPLY =~ ^[Yy]$ ]]
            then
                ftpTest
            fi
    fi
}

clear
echo "This is the installation script for VideoEditorJs."
echo "It will guide you with some easy steps"
read -p "Do you want to install curlftpfs ? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "------- Installing Curlftps -------";
    apt-get install curlftpfs -y
    echo "------- CONFIGURE FTP CREDENCIALS -------";
    ftpTest
    read -p "Mount at startup ? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        echo
        # echo fstab
    fi
    echo "------- CONFIGURE FTP PATHS -------";
    read -p "Root project path :"  -r DATAPATH


fi
echo "------- CONFIGURE LOCAL PATH -------";
echo "/!\\ The directory should not exist /!\\";
read -p "Local data path :"  -r LDATAPATH
mkdir $LDATAPATH;
echo "------- CONFIGURE PATHS -------";
echo "If they not exit they will be created"
read -p "Logs Path"  -r LOGPATH
read -p "Tempory File path"  -r TEMPDIR
mkdir $LOGPATH
mkdir $TEMPDIR
echo "If you made a mistake while typing paths, you can edit them in the generated script file."
echo "------- CONFIGURE SCRIPT -------";
read -p "Start Script at startUp ? " -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo
    #SCRIPT STARTUP
fi
read -p "reStart Script if stoped ? " -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo
    #SCRIPT restart
fi