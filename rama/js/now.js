require(['$api/models',
  'js/artist.graph'
], function(models, artistGraph) {

  var NowPlaying = {
    init: function(config) {
      this.element = config.element;

      this.artist = {};

      this.options = {
        nodes: {
          color: {
            background: '#333',
            border: '#333'
          },
          fontColor: '#eef',
          shape: 'box',
          radius: 24
        }
      };

      this.artistGraph = {};

      return this;
    },

    loadView: function() {
      models.player.load('track').done(function(player) {
        NowPlaying
          .setArtistGraph(models.Artist.fromURI(player.track.artists[0].uri))
          .done(NowPlaying.drawGraph);
      });

      return this;
    },

    updateView: function() {
      this.artistGraph.redraw();

      return this;
    },

    drawGraph: function() {
      NowPlaying.artistGraph.draw();

      return this;
    },

    /**
        Set artist from the current playing track.
        Also creates the artistGraph.
      */
    setArtistGraph: function(artist) {
      NowPlaying.artist = artist;

      NowPlaying.artistGraph = new artistGraph.ArtistGraph(
        NowPlaying.element,
        NowPlaying.artist,
        NowPlaying.options
      );

      return NowPlaying.artistGraph
        .setupGraph();
    }
  };

  exports.NowPlaying = NowPlaying;
});