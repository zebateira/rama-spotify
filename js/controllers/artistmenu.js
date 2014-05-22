require([
  'js/controllers/controller#controller',
  'js/models/element#element',
  '$api/models',
  '$views/image#Image',
  '$views/throbber#Throbber'
], function(Controller, Element, models, Image, Throbber) {


  /**
    Controller for the Artist Menu UI Component
  */
  var ArtistMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);
      this.selectors = config.selectors;

      this.elements = {};
    }
  });

  // Maximum number of albums shown
  ArtistMenu.MAX_ALBUMS = 8;
  // Maximum number of tags shown
  ArtistMenu.MAX_TAGS = 6;


  ArtistMenu.implement({

    // controllers.ArtistMenu depends on controllers.GraphController
    loadController: function(graphcontroller) {
      this.graphcontroller = graphcontroller;

      this.elements = Element.createElements(this.selectors);

      models.player.load('track').done(this, function() {
        this.updateView(models.player.track.artists[0]);
        this.bindAllEvents();
      });
    },
    // Update the UI component given the newArtist parameter
    updateView: function(newArtist) {
      // if no parameter has been given or if it's the same artist
      if (!newArtist ||
        (this.artist && this.artist.uri === newArtist.uri))
        return;

      // update the artist of the menu
      this.artist = newArtist;

      // update all the components
      this.updateImage(this.artist);

      this.artist.load(['popularity', 'years', 'albums'])
        .done(this, this.updateInfo.bind(this));

      this.updateTags(this.artist);
    },
    updateImage: function(artist) {

      // the object views.Image is saved in the Element object
      if (!this.elements.cover.image) {
        this.elements.cover.image =
          Image.forArtist(artist, {
            width: 125,
            height: 80,
            style: 'plain',
            overlay: [artist.name],
            player: true,
            placeholder: 'artist',
            link: 'auto'
          });

        this.elements.cover
          .jelement.append(this.elements.cover.image.node);
      }

      // update the views.Image object with the new artist's info
      this.elements.cover.image.setImage(artist);
      this.elements.cover.image.setOverlay(artist.name);
    },
    updateInfo: function(artist) {
      Element.resetAll(
        [this.elements.albums, this.elements.albumsTitle]
      );

      // update popularity if defined
      this.elements.popularity.html(
        artist.popularity ?
        'Popularity: ' + artist.popularity + '/100' :
        ''
      );

      // update active years if defined
      this.elements.years.html(
        artist.years.from !== 0 ?
        'Years active:<br> ' +
        artist.years.from +
        ' - ' +
        (artist.years.to === 0 ? 'present' : artist.years.to) :
        ''
      );

      // load snapshot of the artist's albums
      artist.albums.snapshot()
        .done(this, this.updateAlbums.bind(this));
    },
    updateAlbums: function(albumSnapshot) {
      var jalbums = this.elements.albums.jelement;

      // albumsAdded - number of added albums
      // used to limit the number of albums added.
      // sometimes the API returns null albums
      for (var i = 0, albumsAdded = 0; i <= albumSnapshot.length &&
        albumsAdded < ArtistMenu.MAX_ALBUMS; ++i) {
        var albumgroup = albumSnapshot.get(i);

        if (albumgroup && albumgroup.albums[0]) {
          var album = albumgroup.albums[0];

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
          albumElement.className = 'artist-album artist-album-cover';
          albumElement.appendChild(albumImage.node);

          jalbums.append(albumElement);
          albumsAdded++;
        }

        if (jalbums.html() !== '') {
          this.elements.albumsTitle.html('Albums: <br>');
        }
      }
    },
    updateTags: function(artist) {
      // Paul Lamere
      // http://developer.echonest.com/forums/thread/353
      // Artist terms -> 
      //      what is the difference between weight and frequency

      // term frequency is directly proportional to how often 
      // that term is used to describe that artist. 
      // Term weight is a measure of how important that term is 
      // in describing the artist. As an example of the difference, 
      // the term 'rock' may be the most frequently applied term 
      // for The Beatles. However, 'rock' is not very descriptive 
      // since many bands have 'rock' as the most frequent term. 
      // However, the most highly weighted terms for The Beatles 
      // are 'merseybeat' and 'british invasion', which give you 
      // a better idea of what The Beatles are all about 
      // than 'rock' does. 
      // We don't publish the details of our algorithms, 
      // but I can tell you that frequency is related to the 
      // simple counting of appearance of a term, whereas 
      // weight is related to TF-IDF as described 
      // here (http://en.wikipedia.org/wiki/Tf%E2%80%93idf).

      // the url to query echonest's API
      // the list of tags being sorted by weight.
      var url =
        "http://developer.echonest.com/api/v4/artist/" +
        "terms?api_key=29N71ZBQUW4XN0QXF&format=json" +
        "&sort=weight" +
        "&id=" + this.artist.uri.replace('spotify', 'spotify-WW');

      $.ajax({
        url: url,
        context: this
      }).done(function(data) {
        this.tags = data.response.terms;

        this.elements.tags.reset();

        if (this.tags.length > 0) {
          this.elements.tagsTitle.html('Tags: <br>');

          for (var i = 0, tagsAdded = 0; i < this.tags.length &&
            tagsAdded < ArtistMenu.MAX_TAGS; ++i) {

            if (this.tags[i]) {
              var tagElement = document.createElement('span');
              tagElement.className = 'artist-tag';
              tagElement.innerHTML = this.tags[i].name;

              this.elements.tags.jelement.append(tagElement);
              tagsAdded++;
            }
          }

          this.artist.tags = this.tags;
        }

      }).fail(function() {
        // Temporary fix for requests limit from echonest
        // just... don't show any tags.
        $(this.selectors.tagsTitle).html('');
      });

    },

    // Events

    bindAllEvents: function() {
      models.player.addEventListener('change',
        this.onPlayerChange.bind(this));

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

        var artist = models.Artist.fromURI(
          models.player.track.artists[0].uri
        );

        if ((this.artist && this.artist.uri === artist.uri) ||
          models.player.track.advertisement) {
          return;
        }

        this.updateView(artist);

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
                var nodeid = ++artistGraph.currentNodeId;

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

              this.graphcontroller.artistGraph.drawGraph(true);
            });
          });
      });

      this.jelement.find(this.selectors.control_expand).hide();
    },
    onBtnNewClick: function(event) {
      this.graphcontroller.setArtistGraph(this.artist);
      this.jelement.find(this.selectors.control_new).hide();
      this.jelement.find(this.selectors.control_delete).hide();
    }

  });

  exports.artistmenu = ArtistMenu;
});