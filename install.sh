#!/bin/sh

version="v0.2"

mkdir ~/Spotify ; cd ~/Spotify
wget https://github.com/carsy/rama-spotify/releases/download/"$version"/rama-spotify_"$version".tar.gz
tar -xvf rama-spotify_"$version".tar.gz
open spotify:app:rama-spotify