require(['$api/models'], function(models) {

  exports.NowPlaying = function() {

    // this.obj = $('.now-playing');

    this.getCurrentArtist = function() {
      return 0;
    };

    this.load = function() {

      models.player.load('track').done(function(player) {
        var curArtistURI = player.track.artists[0].uri;
          console.log(curArtistURI);


      });
    };
  };
});