RAMA - Relational Artist MAps
=========
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![Build Status](https://travis-ci.org/carsy/rama-spotify.png?branch=master)](https://travis-ci.org/carsy/rama-spotify) [![Dependency Status](https://gemnasium.com/carsy/rama-spotify.png)](https://gemnasium.com/carsy/rama-spotify) [![Stories in Ready](https://badge.waffle.io/carsy/rama-spotify.png?label=ready&title=Ready)](https://waffle.io/carsy/rama-spotify)

RAMA is a Spotify Application for visualizing and interacting with networks of music artists. For the original RAMA web application see [rama.inescporto.pt]

For now, I do not intend to make this application available on the Spotify App Store, so to run it you need to set it up first.

To open a downloaded app you need to **Activate Spotify Developer account** here: https://devaccount.spotify.com/my-account (no premium account needed).
Tested on mac for now only.

Installation
--------------

#### Automagic installer

Execute the installer script.

```sh
$ wget --no-check-certificate https://raw.githubusercontent.com/carsy/rama-spotify/master/install.sh -O - | sh
```
or with curl
```sh
$ curl -L https://raw.githubusercontent.com/carsy/rama-spotify/master/install.sh | sh
```

You should now be in the app and seeing a graph thingy.

#### Manual installer

These are the contents of the script:

```sh
$ mkdir ~/Spotify ; cd ~/Spotify
$ rm -rf rama-spotify
$ wget https://github.com/carsy/rama-spotify/releases/download/v0.1.3/rama-spotify_v0.1.3.tar.gz
$ tar -xvf rama-spotify_v0.1.3.tar.gz
$ open spotify:app:rama-spotify
```
You should now be in the app and seeing a graph thingy.

Alternatively, If you happen to have commandlinephobia (I get that every other month... might be a thing):

1. download the latest version of the app from [here]
2. extract the folder
3. create the Spotify folder if it doesn't exist already: "~/Spotify" (Mac OS X) or "My Documents\Spotify" (Windows).
4. copy the extracted folder to the Spotify folder.

Now open Spotify and type in the search bar:
```sh
spotify:app:rama-spotify
```
You should now be in the app and seeing a graph thingy.

### GNU/Linux Support

With no official release for the Spotify Desktop Client, there's nothing I can do about this. Try your luck with wine (playonlinux might be the best option).

[Releases]
----

[v0.1.3] - Play tracks from artist node
  - look and feel of the nodes updated
  - on double click a node in the graph, top tracks of the artist are played

[v0.1.2] - Settings Menu added
  - settings menu added: depth, branching and treemode settings available
  - title attributes on the options' labels give information as to what do the options do.

[v0.1.1] - Graph creation updated
  - graph depth and branchin factor now dynamic
  - nodes are now black
  - root node is highlighted from the others
  - loading throbber added while graph is being created.

[v0.1.0] - First Release
  - graph depth 1 displayed on app load.

It is still in alfa, so please bear with the lack of functionalities (none for now really...).


#### Author

José Bateira
[@\_carsy\_]

[carsy.github.io]

[rama.inescporto.pt]:http://rama.inescporto.pt
[carsy.github.io]:http://carsy.github.io
[@\_carsy\_]:http://twitter.com/_carsy_
[here]:https://github.com/carsy/rama-spotify/releases/latest
[Releases]:https://github.com/carsy/rama-spotify/releases/latest
[v0.1.2]:https://github.com/carsy/rama-spotify/releases/tag/v0.1.3
[v0.1.2]:https://github.com/carsy/rama-spotify/releases/tag/v0.1.2
[v0.1.1]:https://github.com/carsy/rama-spotify/releases/tag/v0.1.1
[v0.1.0]:https://github.com/carsy/rama-spotify/releases/tag/v0.1.0
