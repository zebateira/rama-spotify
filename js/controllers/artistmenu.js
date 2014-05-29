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
  var ArtistMenu = function(name, config) {
    Controller.call(this, name, config);

    this.elements = {};
  };

  // Maximum number of albums shown
  ArtistMenu.MAX_ALBUMS = 8;
  // Maximum number of tags shown
  ArtistMenu.MAX_TAGS = 6;

  ArtistMenu.prototype = Object.create(Controller.prototype);


  // controllers.ArtistMenu depends on controllers.GraphController
  ArtistMenu.prototype.loadController = function(graphcontroller) {
    this.graphcontroller = graphcontroller;

    this.elements = Element.createElements(this.selectors);

    models.player.load('track').done(this, function() {
      this.updateView(models.player.track.artists[0]);
      this.bindAllEvents();
    });
  };

  // Update the UI component given the newArtist parameter
  ArtistMenu.prototype.updateView = function(newArtist) {
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

    this.updateControls(this.artist);
  };

  ArtistMenu.prototype.updateImage = function(artist) {

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
  };

  ArtistMenu.prototype.updateInfo = function(artist) {
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
  };

  ArtistMenu.prototype.updateAlbums = function(albumSnapshot) {
    var jalbums = this.elements.albums.jelement;

    // albumsAdded - number of added albums
    // used to limit the number of albums added.
    // note: sometimes the API returns null albums
    for (var i = 0, albumsAdded = 0; i <= albumSnapshot.length &&
      albumsAdded < ArtistMenu.MAX_ALBUMS; ++i) {
      var albumgroup = albumSnapshot.get(i);

      if (albumgroup && albumgroup.albums[0]) {
        var album = albumgroup.albums[0];

        var albumImage = Image.forAlbum(album, {
          width: 50,
          height: 50,
          style: 'plain',
          link: 'auto',
          player: true,
          placeholder: 'album',
          title: album.name
        });

        // for each album create a DOM element
        var albumElement = document.createElement('span');
        albumElement.className =
          'artist-album artist-album-cover';
        albumElement.appendChild(albumImage.node);

        // and append it to the albums wrapper
        jalbums.append(albumElement);
        albumsAdded++;
      }

      if (jalbums.html() !== '') {
        this.elements.albumsTitle.html('Albums: <br>');
      }
    }
  };

  ArtistMenu.prototype.updateTags = function(artist) {

    this.graphcontroller.fetchTags(this.artist.uri, 'weight')
      .done(fetchDone.bind(this))
      .fail(fetchFail.bind(this));

    function fetchDone(data) {
      // clear the displayed tags
      this.elements.tags.reset();
      this.elements.tagsTitle.reset();

      // not a success response
      if (data.response.status.code !== 0 ||
        (data.response.terms && data.response.terms.length <= 0))
        return;

      this.artist.responseTags = data.response.terms;

      // the echonest's tags are called terms
      this.tags = _.sortBy(data.response.terms
        .slice(0, ArtistMenu.MAX_TAGS), 'name');

      this.elements.tagsTitle.html('Tags: <br>');

      for (var i = 0, tagsAdded = 0; i < this.tags.length; ++i) {
        // for each tag, create a DOM element
        var tagElement = document.createElement('span');
        tagElement.className = 'artist-tag';
        tagElement.innerHTML = this.tags[i].name;

        // and append it to the tags' wrapper
        this.elements.tags.jelement.append(tagElement);
      }

      this.artist.tags = this.tags;
    }

    function fetchFail() {
      // Temporary fix for requests limit from echonest
      // just... don't show any tags.
      // Note: since the API key being used has request limits,
      // sometimes the limit is reached very easily. If so
      // don't show anything.
      this.elements.tagsTitle.reset();
    }

  };

  // control buttons update: shows/hides controls
  // based on the artist
  ArtistMenu.prototype.updateControls = function(artist) {
    var node = _.findWhere(
      this.graphcontroller.getData().nodes, {
        label: artist.name
      });

    // no node found for given artist.
    // This means the artist is not on the graph.
    if (!node) {
      this.elements.controls.jelement.show();
      this.elements.controlNew.jelement.show();
      this.elements.controlExpand.jelement.hide();
      return;
    }

    if (node.isRoot)
    // if the node is root, hide all the controls
      this.elements.controls.jelement.hide();
    else {
      // else show the new control
      this.elements.controls.jelement.show();
      this.elements.controlNew.jelement.show();
    }

    // only show the expand control in leaf nodes
    if (node.isLeaf)
      this.elements.controlExpand.jelement.show();
    else
      this.elements.controlExpand.jelement.hide();
  };

  // Events
  ArtistMenu.prototype.bindAllEvents = function() {
    // the artistmenu is always in sync with 
    // the current playing track
    models.player.addEventListener('change',
      this.events.onPlayerChange.bind(this));

    // the artistmenu always updates when a new node
    // as been selected
    this.graphcontroller.addGraphEvent('click',
      this.events.onClickNode.bind(this));

    // Controls' Events
    this.elements.controlExpand.addDOMEvent({
      eventName: 'onclick',
      handler: this.events.onBtnExpandClick,
      context: this
    });

    this.elements.controlNew.addDOMEvent({
      eventName: 'onclick',
      handler: this.events.onBtnNewClick,
      context: this
    });
  };

  ArtistMenu.prototype.events = {
    // onclick a graph node event
    onClickNode: function(data) {
      var node = _.findWhere(
        this.graphcontroller.getData().nodes, {
          id: parseInt(data.nodes[0])
        });

      console.log('node clicked', node);

      if (!node)
        return;


      this.updateView(node.artist);
    },
    // on track change event
    onPlayerChange: function() {
      models.player.load('track').done(this, function(player) {

        var artist = models.Artist.fromURI(
          models.player.track.artists[0].uri
        );

        // ignore if it's the same artist or an ad is playing
        if ((this.artist && this.artist.uri === artist.uri) ||
          models.player.track.advertisement) {
          return;
        }

        this.updateView(artist);
      });
    },
    // Expand control button click event
    onBtnExpandClick: function(event) {
      this.graphcontroller.expandNode(this.artist);
      this.graphcontroller.highlightArtist(this.artist);

      this.elements.controlExpand.jelement.hide();
    },
    // New control button click event
    onBtnNewClick: function(event) {
      this.graphcontroller.newGraph(this.artist);
      this.elements.controlNew.jelement.hide();
    }
  };

  ArtistMenu.prototype.constructor = ArtistMenu;

  exports.artistmenu = ArtistMenu;
});