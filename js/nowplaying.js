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
  init: function(viewId, viewpath) {
    nowplaying.viewId = viewId;
    nowplaying.selector = '#' + viewId;
    nowplaying.viewpath = viewpath;

    nowplaying.options = {
      nodes: {
        color: {
          background: '#333',
          border: '#555'
        },
        fontColor: '#eef',
        shape: 'box',
        radius: 1
      }
      // clustering: true
    };

    return nowplaying;
  },

  loadView: function() {
    $(nowplaying.selector)
      .load(nowplaying.viewpath, nowplaying.afterLoad);
  },
  afterLoad: function(data) {
    nowplaying.currentArtist.load(nowplaying.setArtistGraph);
    nowplaying.loadSettingsMenu();
    models.player.addEventListener('change', nowplaying.events.onPlayerChange);
  },

  updateView: function() {
    if (nowplaying.artistGraph)
      nowplaying.artistGraph.redraw();

    return nowplaying;
  },
  events: {
    onPlayerChange: function(player) {

      nowplaying.currentArtist.load(function(currentArtist, advertisement) {
        var oldArtistURI = nowplaying.artistGraph.artist.uri;

        if (advertisement)
          return;

        if (currentArtist.uri !== oldArtistURI)
          nowplaying.setArtistGraph(currentArtist);
      });
    },
    onSettingsBtnClick: function(event) {
      $(nowplaying.selector + ' .settings-tooltip').toggle();
    }
  },

  loadSettingsMenu: function() {
    $(nowplaying.selector + ' .settings-btn').click(nowplaying.events.onSettingsBtnClick);

    $(nowplaying.selector + ' .settings-tooltip input[name=branching]').on('change', function() {
      nowplaying.showThrobber();
      nowplaying.artistGraph.updateGraph({
        branching: parseInt(this.value)
      });
      nowplaying.artistGraph.buildGraph();
    });

    $(nowplaying.selector + ' .settings-tooltip input[name=depth]').on('change', function() {
      nowplaying.showThrobber();
      nowplaying.artistGraph.updateGraph({
        depth: parseInt(this.value)
      });
      nowplaying.artistGraph.buildGraph();
    });

    $(nowplaying.selector + ' .settings-tooltip input[name=treemode]').on('change', function() {
      nowplaying.showThrobber();
      nowplaying.artistGraph.updateGraph({
        treemode: this.checked
      });
      nowplaying.artistGraph.buildGraph();
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

    nowplaying.artistGraph = new artistGraph.ArtistGraph({
        depth: 2,
        branching: 4
      },
      $(nowplaying.selector + ' .graph')[0],
      artist,
      nowplaying.options
    );

    nowplaying.showThrobber();
    nowplaying.artistGraph.buildGraph();
  },
  showThrobber: function() {
    if (nowplaying.artistGraph.throbber)
      nowplaying.artistGraph.throbber.hide();

    nowplaying.artistGraph.throbber = Throbber.forElement(document.getElementById(nowplaying.viewId));
    nowplaying.artistGraph.throbber.setPosition('center', 'center');
  }
};