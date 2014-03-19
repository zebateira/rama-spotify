/**
  Now Playing Module.

  Gets current playing artist and draws graph
*/

var models = {};
var Throbber = {};
var artistGraph = {};


var nowplaying = {};

require([
  '$api/models',
  '$views/throbber#Throbber',
  'js/artistgraph'
], function(_models, _throbber, _artistGraph) {

  models = _models;
  Throbber = _throbber;
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
      },
      clustering: true
    };

    return nowplaying;
  },

  loadView: function() {
    this.throbber = Throbber.forElement(document.getElementById('now'));

    models.player.load('track').done(function(player) {
      nowplaying
        .setArtistGraph(
          models.Artist.fromURI(player.track.artists[0].uri))
        .done(function() {

          nowplaying.drawGraph();
          console.log('artistgraph: draw');
        });
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
        branching: 5,
        depth: 3
      },
      nowplaying.element,
      artist,
      nowplaying.options
    );

    return nowplaying.artistGraph.buildGraph(this.throbber);
  }
};