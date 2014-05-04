require([
  '$api/models',
  'js/controllers/controller#controller',
  '$views/image#Image'
], function(models, Controller, Image) {

  var ArtistMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);
      this.selectors = config.selectors;

      var onPlayerChange = this.onPlayerChange.bind(this);
      models.player.addEventListener('change', function() {
        models.player.load('track').done(onPlayerChange);
      });
    }
  });

  ArtistMenu.implement({
    afterLoad: function(graphcontroller) {
      this.graphcontroller = graphcontroller;

      models.player.load('track').done(this, function() {
        this.artist = models.Artist.fromURI(
          models.player.track.artists[0].uri);

        this.updateView(this.artist);

        this.bindEvents();
      });
    },
    bindEvents: function() {
      this.graphcontroller.addGraphEvent('click',
        this.onClickNode.bind(this));

      var controls = {
        expand: 'onBtnExpandClick',
        new: 'onBtnNewClick',
        delete: 'onBtnDeleteClick',
      };

      for (var control in controls) {
        var element =
          document.getElementById('control_' + control);

        element.onclick = this[controls[control]].bind(this);
      }
    },
    updateView: function(artist) {
      if (!artist || this.artist === artist.uri)
        return;

      if (!this.image) {
        this.image = Image.forArtist(artist, {
          width: 150,
          height: 100,
          style: 'plain',
          overlay: [artist.name],
          player: true,
          placeholder: 'artist',
          link: 'auto'
        });

        this.jelement.find(this.selectors.cover).append(this.image.node);
      }

      this.image.setImage(artist);
      this.image.setOverlay(artist.name);

      this.jelement.find(this.selectors.albums).html('');

      artist.load(['popularity', 'years', 'albums'])
        .done(this, function(artist) {
          if (artist.popularity)
            this.jelement.find(this.selectors.popularity)
              .html('Popularity: ' + artist.popularity + '/100');
          else
            this.jelement.find(this.selectors.popularity).html('');

          if (artist.years.from !== 0)
            this.jelement.find(this.selectors.years).html(
              'Years active:<br> ' +
              artist.years.from +
              ' - ' +
              (artist.years.to === 0 ? 'present' : artist.years.to)
            );
          else
            this.jelement.find(this.selectors.years).html('');

          var jalbums = this.jelement.find(this.selectors.albums);
          artist.albums.snapshot(0, 8).done(this,
            function(snapshot) {
              for (var i = 0; i <= 8; ++i) {
                if (snapshot.get(i) && snapshot.get(i).albums[0] &&
                  snapshot.get(i).albums[0].playable) {
                  var album = snapshot.get(i).albums[0];

                  if (!jalbums.find("a[href='" + album.uri + "']")[0]) {
                    var albumImage = Image.forAlbum(album, {
                      width: 50,
                      height: 50,
                      style: 'plain',
                      player: true,
                      placeholder: 'album',
                      link: 'auto',
                      title: album.name
                    });

                    var albumElement = document.createElement('span');
                    albumElement.className = 'artist-album';
                    albumImage.node.className += ' artist-album-cover';
                    $(albumElement).append(albumImage.node);
                    jalbums.append(albumElement);
                  }
                }
              }
            });
        });

    },
    onPlayerChange: function() {
      models.player.load('track').done(this, function(player) {
        var artist = models.Artist.fromURI(player.track.artists[0].uri);

        if ((this.artist && this.artist.uri === artist.uri) ||
          player.track.advertisement) {
          return;
        }

        this.artist = artist;
        this.updateView(this.artist);
      });
    },
    onClickNode: function(data) {
      var node = _.findWhere(
        this.graphcontroller.artistGraph.data.nodes, {
          id: parseInt(data.nodes[0])
        });

      if (!node || node.artist.uri === this.artist.uri)
        return;

      if (node.id === 1) {
        this.jelement.find(this.selectors.controls).hide();
      } else
        this.jelement.find(this.selectors.controls).show();

      this.updateView(node.artist);
      this.artist = node.artist;
    },
    onBtnExpandClick: function(event) {
      // TODO expand node (depth one)
      // try to save nodes positions
      // then add nodes and edges
      // create new graph with updated nodes and edges
      // setPosition(savedPositions)
    },
    onBtnNewClick: function(event) {
      // TODO create new map from selected node
      this.graphcontroller.updateArtist(this.artist);
    },
    onBtnDeleteClick: function(event) {
      // TODO delete node from graph
      // save nodes' positions
      // delete node from graph
      // create new graph from updated data
      // 
    }

  });

  exports.artistmenu = ArtistMenu;
});