  require([
      'js/controllers/controller#controller',
      '$api/models',
      '$views/image#Image',
      '$views/throbber#Throbber',
    ],
    function(Controller, models, Image, Throbber) {

      var TrackList = new Class({
        Extends: Controller,

        initialize: function(name, config) {
          this.parent(name, config);

          this.selectors = config.selectors;

          _.bindAll(this, 'onPlayerChange');
          var onPlayerChange = this.onPlayerChange;

          models.player.addEventListener('change', function(player) {
            models.player.load('track').done(onPlayerChange);
          });
        }

      });

      TrackList.implement({
        afterLoad: function() {
          this.load();
        },
        updateView: function() {},
        load: function() {

          models.player.load('track').done(this, function() {
            var artist = models.Artist.fromURI(models.player.track.artists[0].uri);

            if ((this.artist && this.artist.uri === artist.uri) ||
              models.player.track.advertisement) {
              return;
            }

            this.artist = artist;

            this.jelement.find(this.selectors.cover).html('');
            this.jelement.find(this.selectors.list).html('');

            this.image = Image.forArtist(artist, {
              width: 50,
              height: 50,
              style: 'plain',
            });
            var wrapper =
              $(this.selector).find(this.selectors.cover);

            $(wrapper).append(this.image.node);
            $(this.selectors.title).html('More popular tracks by ' + artist.name);

            var compilations = models.Playlist.fromURI(artist.uri);

            compilations.load('tracks').done(this, function() {

              compilations.tracks.snapshot(0, 6).done(this, function(snapshot) {
                var tracks = snapshot.toArray();

                for (var i = 0; i < 6; ++i) {
                  var track = tracks[i];
                  var element = document.createElement('span');

                  element.innerHTML = track.name;
                  element.uri = track.uri;
                  element.className = 'list-track';
                  element.onclick = this.onTrackClick;

                  this.jelement.find(this.selectors.list)
                    .append(element);
                }
              });
            });
          });
        },
        onPlayerChange: function(player) {
          this.load();
        },
        onTrackClick: function(event) {
          models.player.playTrack(models.Track.fromURI(event.target.uri));
        }
      });

      exports.tracklist = TrackList;
    });