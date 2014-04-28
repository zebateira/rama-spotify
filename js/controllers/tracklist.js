require([
    'js/controllers/controller#controller',
    '$api/models',
    '$views/image#Image',
    'js/exceptions#ConfigObjectMissing'
  ],
  function(Controller, models, Image, ConfigObjectMissing) {

    var TrackList = new Class({
      Extends: Controller,

      initialize: function(name, config) {
        this.parent(name, config);

      },
      selectors: {
        cover: '#tracklist_cover',
        list: '#list_title'
      }
    });

    TrackList.implement({
      afterLoad: function() {
        this.loadImage();
      },
      updateView: function() {
        this.loadImage();
      },
      loadImage: function() {
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
            $(this.selector).find('#tracklist_cover').html('');

          $(wrapper).append(this.image.node);

          $(this.selectors.list).html('More from ' + artist.name);

        // artist.load('compilations').done(function(artist) {
        //   artist.compilations.loadAll('type').each(function(track) {
        //     console.log(track);
        //   });
        //   artist.compilations.snapshot(0, 10).done(function(snapshot) {
        //     snapshot.loadAll('name').each(function(track) {
        //       console.log(track);
        //     });
        //   });
        // });
        });

      }
    });

    exports.tracklist = TrackList;
  });