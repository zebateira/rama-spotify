#!/bin/sh

version="v0.9.1"

mkdir ~/Spotify ; cd ~/Spotify
rm -rf rama-spotify
rm -rf rama
rm rama_"$version".tar.gz
rm rama_"$version".zip
curl -L -O https://github.com/carsy/rama-spotify/releases/download/"$version"/rama_"$version".tar.gz
tar -xf rama_"$version".tar.gz
open spotify:app:rama