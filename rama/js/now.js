require(['$api/models', '$views/image'], function(models, image) {

  exports.NowPlaying = function() {

    this.load = function() {

      models.player.load('track').done(function(player) {
       var currentArtist = models.Artist.fromURI(player.track.artists[0].uri);

        currentArtist.load('related').done(function(artist) {
          artist.related.snapshot().done(function(snapshot) {

            var artists = snapshot.toArray();

            artists.forEach(function(artist) {

              $('.now-playing').append(
                $(image.Image.forArtist(artist, {width: 100, height: 100, player: true})
                  .node).addClass('artist-cover')
              );

            });
          });
        });
      });
    };
  };
});