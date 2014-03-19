/**
  Now Playing Module.

  Gets current playing artist and draws graph
*/

var models = {};
var artistGraph = {};
var nowplaying = {};

require([
  '$api/models',
  'js/artistgraph'
], function(_models, _artistGraph) {

  models = _models;
  artistGraph = _artistGraph;

  exports.nowplaying = nowplaying;
});

nowplaying = {
  name: 'nowplaying',
  init: function(viewId) {
    nowplaying.element = $('#' + viewId + ' .graph')[0];

    nowplaying.options = {
      nodes: {
        color: {
          background: '#333',
          border: '#333'
        },
        fontColor: '#eef',
        shape: 'box',
        radius: 1
      }
    };

    return nowplaying;
  },

  loadView: function() {
    models.player.load('track').done(function(player) {
      nowplaying
        .setArtistGraph(
          models.Artist.fromURI(player.track.artists[0].uri))
        .done(nowplaying.drawGraph);
    });

    return nowplaying;
  },

  updateView: function() {
    if (nowplaying.artistGraph)
      nowplaying.artistGraph.redraw();

    return nowplaying;
  },

  drawGraph: function() {
    nowplaying.artistGraph.draw();

    return nowplaying;
  },

  /**
    Set artist from the current playing track.
    Also creates the artistGraph.
  */
  setArtistGraph: function(artist) {
    nowplaying.artistGraph = new artistGraph.ArtistGraph({
        maxChildNodes: 5
      },
      nowplaying.element,
      artist,
      nowplaying.options
    );

    return nowplaying.artistGraph
      .setupGraph();
  }
};