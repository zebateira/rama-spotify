  require([
      'js/controllers/controller#controller',
      '$api/models',
      '$views/image#Image',
      'js/exceptions#ConfigObjectMissing',
      '$views/throbber#Throbber',
    ],
    function(Controller, models, Image, ConfigObjectMissing, Throbber) {

      var TrackList = new Class({
        Extends: Controller,

        initialize: function(name, config) {
          this.parent(name, config);
        }

      });

      TrackList.implement({
        afterLoad: function() {
          this.load();
        },
        updateView: function() {
          // this.load();
        },
        load: function() {

          this.jelement.find(this.config.selectors.cover).html('');
          this.jelement.find(this.config.selectors.list).html('');

          models.player.load('track').done(this, function(player) {
            var artist = models.Artist.fromURI(
              models.Artist.fromURI(player.track.artists[0].uri)
            );

            this.image = Image.forArtist(artist, {
              width: 50,
              height: 50,
              style: 'plain',
            });
            var wrapper =
              $(this.selector).find(this.config.selectors.cover);

            $(wrapper).append(this.image.node);

            $(this.config.selectors.title).html('More from ' + artist.name);

            var compilations = models.Playlist.fromURI(artist.uri);

            compilations.load('tracks').done(this, function() {

              compilations.tracks.snapshot(0, 6).done(this, function(snapshot) {
                var tracks = snapshot.toArray();

                for (var i = 0; i < 6; ++i) {
                  var track = tracks[i];
                  var element = document.createElement('span');

                  element.innerHTML = '<a href="' + track.uri + '">' +
                    track.name + '</a>';
                  element.className = 'list-track';

                  this.jelement.find(this.config.selectors.list)
                    .append(element);

                }
              });
            });
          });

        }
      });

      exports.tracklist = TrackList;
    });