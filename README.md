RAMA - Relational Artist MAps
=========

Spotify App

RAMA is a Spotify Application for visualizing and interacting with networks of music artists. For the original RAMA web application see [rama.inescporto.pt]

For now, I do not intend to make this application available on the Spotify App Store, so to run it you need to set it up first.


Installation
--------------
Tested on mac for now only.

Run the following commands from the command prompt (for mac):
```sh
mkdir ~/Spotify ; cd ~/Spotify
git clone https://github.com/carsy/rama-spotify.git
```

Alternatively, If you happen to have commandlinephobia (I get that every other month... might be a thing):

1. download the app from [here]
2. extract and rename the folder to "rama-spotify"
3. copy the folder to the Spotify folder that should be in your home directory (create it if it does not exist yet). In Windows should be your "My Documents" folder.

Now open Spotify and type in the search bar:
```sh
spotify:app:rama-spotify
```
You should now be in the app and seeing a graph thingy.

### GNU/Linux

With no official Spotify Desktop Client release there's nothing I can do about this. Try your luck with wine (playonlinux might be the best option).

Version
----

0.1.0

It is still in alfa, so please bear with the lack of functionalities.
I mean, you wouldn't download a bear...


#### Author

José Bateira
[@\_carsy\_]

[carsy.github.io]

[rama.inescporto.pt]:http://rama.inescporto.pt
[carsy.github.io]:http://carsy.github.io
[@\_carsy\_]:http://twitter.com/_carsy_
[here]:https://github.com/carsy/rama-spotify/archive/master.zip
    