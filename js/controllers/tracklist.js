require([
  'js/controllers/controller#controller',
  'js/models/element#element',
  '$api/models',
  '$views/image#Image',
  '$views/throbber#Throbber'
], function(
  Controller,
  Element,
  models,
  Image,
  Throbber) {

  /**
    Controller for the Tracklist UI Component

    Extends the controllers.Controller generic class
  */
  var TrackList = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.selectors = config.selectors;
      // DOM elements to be initialized on this.loadController
      this.elements = {};
    }

  });

  TrackList.MAX_TRACKS = 6;

  TrackList.implement({
    loadController: function() {

      // Creates all of the Elements declared in the selectors obj
      this.elements = Element.createElements(this.selectors);

      // load now playing track from player
      models.player.load('track').done(this, function() {
        // current track's artist
        var artist = models.Artist.fromURI(
          models.player.track.artists[0].uri
        );

        // ignore artist if it's the same artist
        // or if it's an ad (similar to name === 'Spotify')
        if ((this.artist && this.artist.uri === artist.uri) ||
          models.player.track.advertisement) {
          return;
        }

        // save current track's artist
        this.artist = artist;
        // clean the menu
        Element.resetAll(this.elements);

        // load artist's image into the UI component
        this.loadImage(artist);
        // load the appropriate title into the UI component
        this.loadTitle(artist);
        // load the artist's top track list into the UI Component 
        this.loadTracks(artist);

        this.bindAllEvents();
      });
    },
    // load artist's image into the UI component using the
    // spotify's views.Image
    loadImage: function(artist) {
      this.elements.cover.jelement
        .html(Image.forArtist(artist, {
          width: 50,
          height: 50,
          style: 'plain',
        }).node);
    },
    // load the appropriate title into the UI component
    // given the artist's name
    loadTitle: function(artist) {
      this.elements.title.jelement
        .html('More popular tracks by ' + artist.name);
    },
    // load the artist's top track list into the UI Component
    loadTracks: function(artist) {

      // create a playlist for the artist and load its tracks
      models.Playlist.fromURI(artist.uri).load('tracks')
        .done(this, function(playlist) {

          //  create a snapshot of the current playlist
          playlist.tracks.snapshot(0, TrackList.MAX_TRACKS)
            .done(this, function(snapshot) {

              // create a DOM element span for each track
              // and add it to the DOM.
              var tracks = snapshot.toArray();
              for (var i = 0; i < TrackList.MAX_TRACKS; ++i) {
                var track = tracks[i];
                var element = document.createElement('span');


                // the spotify's uri of the track
                // is added to the element
                // to be later on used to play the track
                // on the onTrackClick event
                element.uri = track.uri;
                element.innerHTML = track.name;
                element.className = 'list-track';
                element.onclick = this.onTrackClick;

                this.elements.list.jelement.append(element);
              }
            });
        });
    },

    // Events
    onPlayerChange: function(player) {
      this.loadController();
    },

    // 
    onTrackClick: function(event) {
      models.player.playTrack(
        // the previously saved uri property is used
        // to create the models.Track object
        models.Track.fromURI(event.target.uri)
      );
    },

    // bind all the wanted events
    bindAllEvents: function() {
      models.player.addEventListener('change',
        this.onPlayerChange.bind(this));
    }
  });

  exports.tracklist = TrackList;
});