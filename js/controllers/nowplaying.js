/**
  Now Playing Module.

  Gets current playing artist and draws graph
*/

var models = {};
var Throbber = {};
var artistGraph = {};

var NowPlaying;

require([
  '$api/models',
  '$views/throbber#Throbber',
  'js/models/artistgraph'
], function(_models, _throbber, _artistGraph) {

  models = _models;
  Throbber = _throbber;
  artistGraph = _artistGraph;

  exports.NowPlaying = NowPlaying;
});

NowPlaying = {
  init: function(viewId, viewpath) {
    NowPlaying.viewId = viewId;
    NowPlaying.selector = '#' + viewId;
    NowPlaying.viewpath = viewpath;

    NowPlaying.options = {
      nodes: {
        color: {
          background: '#333',
          border: '#555'
        },
        fontColor: '#eef',
        shape: 'box',
        radius: 1
      },
      stabilize: true
      // clustering: true
    };

    return NowPlaying;
  },

  loadView: function() {
    $(NowPlaying.selector)
      .load(NowPlaying.viewpath, NowPlaying.afterLoad);
  },
  afterLoad: function(data) {
    NowPlaying.currentArtist.load(NowPlaying.setArtistGraph);
    NowPlaying.loadSettingsMenu();
    models.player.addEventListener('change', NowPlaying.events.onPlayerChange);
  },

  updateView: function() {
    if (NowPlaying.artistGraph)
      NowPlaying.artistGraph.redraw();

    return NowPlaying;
  },
  events: {
    onPlayerChange: function(player) {

      NowPlaying.currentArtist.load(function(currentArtist, advertisement) {
        var oldArtistURI = NowPlaying.artistGraph.artist.uri;

        if (advertisement)
          return;

        if (currentArtist.uri !== oldArtistURI)
          NowPlaying.setArtistGraph(currentArtist);
      });
    },
    onSettingsBtnClick: function(event) {
      $(NowPlaying.selector + ' .settings-tooltip').toggle();
    }
  },

  loadSettingsMenu: function() {
    $(NowPlaying.selector + ' .settings-btn').click(NowPlaying.events.onSettingsBtnClick);

    $(NowPlaying.selector + ' .settings-tooltip input[name=branching]').on('change', function() {
      NowPlaying.showThrobber();
      NowPlaying.artistGraph.updateGraph({
        branching: parseInt(this.value)
      });
      NowPlaying.artistGraph.buildGraph();
    });

    $(NowPlaying.selector + ' .settings-tooltip input[name=depth]').on('change', function() {
      NowPlaying.showThrobber();
      NowPlaying.artistGraph.updateGraph({
        depth: parseInt(this.value)
      });
      NowPlaying.artistGraph.buildGraph();
    });

    $(NowPlaying.selector + ' .settings-tooltip input[name=treemode]').on('change', function() {
      NowPlaying.showThrobber();
      NowPlaying.artistGraph.updateGraph({
        treemode: this.checked
      });
      NowPlaying.artistGraph.buildGraph();
    });
  },

  currentArtist: {
    load: function(callback) {
      models.player.load('track').done(function(player) {
        callback(models.Artist.fromURI(player.track.artists[0].uri),
          player.track.advertisement);
      });
    }
  },

  /**
    Set artist from the current playing track.
    Also creates the artistGraph.
  */
  setArtistGraph: function(artist) {

    NowPlaying.artistGraph = new artistGraph.ArtistGraph({
        depth: 2,
        branching: 4
      },
      $(NowPlaying.selector + ' .graph')[0],
      artist,
      NowPlaying.options
    );

    NowPlaying.showThrobber();
    NowPlaying.artistGraph.buildGraph();
  },
  showThrobber: function() {
    if (NowPlaying.artistGraph.throbber)
      NowPlaying.artistGraph.throbber.hide();

    NowPlaying.artistGraph.throbber = Throbber.forElement(document.getElementById(NowPlaying.viewId));
    NowPlaying.artistGraph.throbber.setPosition('center', 'center');
  }
};