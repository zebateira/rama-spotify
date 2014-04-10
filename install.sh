#!/bin/sh

mkdir ~/Spotify ; cd ~/Spotify
rm -rf rama-spotify
wget https://github.com/carsy/rama-spotify/releases/download/v0.1.3/rama-spotify_v0.1.3.tar.gz
tar -xvf rama-spotify_v0.1.3.tar.gz
open spotify:app:rama-spotify
