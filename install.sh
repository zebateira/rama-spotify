#!/bin/sh

version="v0.5"

mkdir ~/Spotify ; cd ~/Spotify
rm -rf rama-spotify
rm -rf rama
wget https://github.com/carsy/rama-spotify/releases/download/"$version"/rama_"$version".tar.gz
tar -xvf rama_"$version".tar.gz
open spotify:app:rama