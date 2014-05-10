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
        document.getElementById('control_' + control)
          .onclick = this[controls[control]].bind(this);
      }


    },
    updateView: function(artist) {
      if (!artist || this.artist === artist.uri)
        return;

      this.artist = artist;

      if (!this.image) {
        this.image = Image.forArtist(artist, {
          width: 125,
          height: 80,
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
      this.jelement.find(this.selectors.albumsTitle).html('');

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

                if (i === 8 && jalbums.html() !== '') {
                  this.jelement
                    .find(this.selectors.albumsTitle).html('Albums: <br>');
                }
              }
            });
        });

      var url = "http://developer.echonest.com/api/v4/artist/terms?api_key=29N71ZBQUW4XN0QXF&format=json&name=" + this.artist.name;

      $.ajax({
        url: url,
        context: this
      }).done(function(data) {
        this.tags = data.response.terms;

        $(this.selectors.tags).html('');

        if (this.tags.length > 0)
          $(this.selectors.tagsTitle).html('Tags: <br>');

        for (var i = 0; i < this.tags.length && i < 6; ++i) {
          if (this.tags[i]) {
            var tagElement = document.createElement('span');
            tagElement.className = 'artist-tag';
            tagElement.innerHTML = this.tags[i].name;

            $(this.selectors.tags).append(tagElement);
          }
        }

      }).fail(function() {
        console.log(arguments);
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
      } else {
        $(this.selectors.control_new).show();
        this.jelement.find(this.selectors.controls).show();
      }

      if (node.isLeaf) {
        this.jelement.find(this.selectors.control_expand).show();
        // this.jelement.find(this.selectors.control_delete).show();
      } else {
        this.jelement.find(this.selectors.control_expand).hide();
        // this.jelement.find(this.selectors.control_delete).hide();
      }

      this.updateView(node.artist);

    },
    onPlayerChange: function() {
      models.player.load('track').done(this, function(player) {

        if (player.track.advertisement)
          return;

        var artist = models.Artist.fromURI(player.track.artists[0].uri);

        if ((this.artist && this.artist.uri === artist.uri) ||
          player.track.advertisement) {
          return;
        }

        this.updateView(models.player.track.artists[0]);

        this.jelement.find(this.selectors.controls).show();
        this.jelement.find(this.selectors.control_new).show();
        this.jelement.find(this.selectors.control_expand).hide();
      });
    },
    onBtnExpandClick: function(event) {

      var node = _.findWhere(
        this.graphcontroller.artistGraph.data.nodes, {
          id: this.artist.nodeid
        });

      node.color = {
        border: '#7fb701',
        background: '#313336'
      };
      node.isLeaf = false;

      this.artist.load('related').done(this, function(artist) {
        var rootArtist = artist;
        artist.related.snapshot(0,
          this.graphcontroller.artistGraph.branching).done(this,
          function(snapshot) {
            snapshot.loadAll(['name', 'uri']).each(this, function(artist) {
              var artistGraph = this.graphcontroller.artistGraph;

              var duplicated = _.findWhere(artistGraph.data.nodes, {
                label: artist.name
              });

              if (duplicated && artist.name !== rootArtist.name) {
                var inverseEdgeExists = _.findWhere(artistGraph.data.edges, {
                  from: duplicated.id,
                  to: rootArtist.nodeid
                });
                var edgeExists = _.findWhere(artistGraph.data.edges, {
                  to: duplicated.id,
                  from: rootArtist.nodeid
                });

                if (!inverseEdgeExists && !edgeExists) {
                  var extraEdge = {
                    from: rootArtist.nodeid,
                    to: duplicated.id,
                  };

                  artistGraph.extraEdges.push(extraEdge);

                  if (!artistGraph.treemode)
                    artistGraph.data.edges.push(extraEdge);
                }
              } else {
                var nodeid = ++artistGraph.index;

                artistGraph.data.nodes.push({
                  id: nodeid,
                  label: artist.name,
                  artist: artist,
                  isLeaf: true
                });

                artistGraph.data.edges.push({
                  from: rootArtist.nodeid,
                  to: nodeid
                });

                artistGraph.relatedArtists.push(artist);

                artist.nodeid = nodeid;
              }
            }).done(this, function() {

              this.graphcontroller.updateData();

            });
          });
      });

      this.jelement.find(this.selectors.control_expand).hide();
    },
    onBtnNewClick: function(event) {
      this.graphcontroller.updateArtist(this.artist);
      this.jelement.find(this.selectors.control_new).hide();
      this.jelement.find(this.selectors.control_delete).hide();
    },
    onBtnDeleteClick: function(event) {
      // var node = _.findWhere(
      //   this.graphcontroller.artistGraph.data.nodes, {
      //     id: this.artist.nodeid
      //   }
      // );

      // var index = this.graphcontroller.artistGraph.data.nodes.indexOf(node);
      // this.graphcontroller.artistGraph.data.nodes.splice(index, 1);
      // this.graphcontroller.updateData();
    }

  });

  exports.artistmenu = ArtistMenu;
});