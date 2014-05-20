require([
  '$api/models',
  'js/controllers/controller#controller',
  '$views/image#Image',
  '$views/throbber#Throbber'
], function(models, Controller, Image, Throbber) {

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

  ArtistMenu.MAX_ALBUMS = 8;
  ArtistMenu.MAX_TAGS = 6;

  ArtistMenu.implement({
    loadController: function(graphcontroller) {
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
        new: 'onBtnNewClick'
      };

      for (var control in controls) {
        document.getElementById('control_' + control)
          .onclick = this[controls[control]].bind(this);
      }


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
      } else {
        this.jelement.find(this.selectors.control_expand).hide();
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
      this.graphcontroller.showThrobber();

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
              this.graphcontroller.artistGraph.throbber.hide();

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
    updateView: function(artist) {
      if (!artist || this.artist === artist.uri)
        return;

      this.artist = artist;

      this.updateImage(artist);
      this.updateInfo(artist);
      this.updateTags(artist);
    },
    updateImage: function(artist) {
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

    },
    updateInfo: function(artist) {
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
          var albumsAdded = 0;
          var jalbums = this.jelement.find(this.selectors.albums);
          artist.albums.snapshot().done(this,
            function(snapshot) {
              for (var i = 0; i <= snapshot.length && albumsAdded < ArtistMenu.MAX_ALBUMS; ++i) {
                if (snapshot.get(i)) {

                  if (snapshot.get(i).albums[0]) {
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
                      albumsAdded++;
                    }
                  }

                  if (jalbums.html() !== '') {
                    this.jelement
                      .find(this.selectors.albumsTitle).html('Albums: <br>');
                  }
                }
              }
            });
        });

    },
    updateTags: function(artist) {
      // Paul Lamere
      // http://developer.echonest.com/forums/thread/353
      // Artist terms -> what is the difference between weight and frequency

      // term frequency is directly proportional to how often 
      // that term is used to describe that artist. 
      // Term weight is a measure of how important that term is 
      // in describing the artist. As an example of the difference, 
      // the term 'rock' may be the most frequently applied term 
      // for The Beatles. However, 'rock' is not very descriptive 
      // since many bands have 'rock' as the most frequent term. 
      // However, the most highly weighted terms for The Beatles 
      // are 'merseybeat' and 'british invasion', which give you 
      // a better idea of what The Beatles are all about than 'rock' does. 
      // We don't publish the details of our algorithms, 
      // but I can tell you that frequency is related to the 
      // simple counting of appearance of a term, whereas 
      // weight is related to TF-IDF as described 
      // here (http://en.wikipedia.org/wiki/Tf%E2%80%93idf).

      var url =
        "http://developer.echonest.com/api/v4/artist/" +
        "terms?api_key=29N71ZBQUW4XN0QXF&format=json&sort=weight&id=" +
        this.artist.uri.replace('spotify', 'spotify-WW');

      $.ajax({
        url: url,
        context: this
      }).done(function(data) {
        this.tags = data.response.terms;

        $(this.selectors.tags).html('');

        if (this.tags.length > 0) {
          $(this.selectors.tagsTitle).html('Tags: <br>');
          var tagsInserted = 0;

          for (var i = 0; i < this.tags.length && tagsInserted < ArtistMenu.MAX_TAGS; ++i) {
            var tag = this.tags[i];

            if (tag) {
              var tagElement = document.createElement('span');
              tagElement.className = 'artist-tag';
              tagElement.innerHTML = tag.name;

              $(this.selectors.tags).append(tagElement);
              tagsInserted++;
            }
          }

          this.artist.tags = this.tags;
        }


      }).fail(function() {
        // Temporary fix for requests limit from echonest
        $(this.selectors.tagsTitle).html('');
      });

    }

  });

  exports.artistmenu = ArtistMenu;
});