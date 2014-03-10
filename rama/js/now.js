require(['$api/models',
  'js/artist.graph#ArtistGraph'
], function(models, ArtistGraph) {

  var NowPlaying = {
    init: function(config) {
      this.element = config.element;

      return this;
    },

    loadView: function() {
      this.drawGraph();

      return this;
    },
    drawGraph: function() {
      var self = this;

      models.player.load('track').done(function(player) {
        var currentArtist = models.Artist.fromURI(player.track.artists[0].uri);

        new ArtistGraph(currentArtist)
          .drawGraph(self.element);
      });

      return this;
    }

  };

  exports.NowPlaying = NowPlaying;
});