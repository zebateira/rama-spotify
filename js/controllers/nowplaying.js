/**
  Now Playing Module.

  Gets current playing artist and draws graph
*/

var models = {};
var Throbber = {};
var artistGraph = {};


var NowPlaying = function(viewId, viewpath) {
  this.viewId = viewId;
  this.selector = '#' + viewId;
  this.viewpath = viewpath;

  this.options = {
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
};

NowPlaying.prototype = {
  loadView: function() {
    var self = this;

    $(this.selector).load(this.viewpath, function() {
      self.currentArtist.load(self, self.setArtistGraph);
      self.loadSettingsMenu();
      models.player.addEventListener('change', function(player) {
        self.events.onPlayerChange(self, player);
      });
    });
  },
  updateView: function() {
    if (this.artistGraph)
      this.artistGraph.redraw();

    return this;
  },
  events: {
    onPlayerChange: function(self, player) {
      self.currentArtist.load(self, function(self, currentArtist, advertisement) {
        var oldArtistURI = self.artistGraph.artist.uri;

        if (advertisement)
          return;

        if (currentArtist.uri !== oldArtistURI)
          self.setArtistGraph(self, currentArtist);
      });
    },
    onSettingsBtnClick: function(self) {
      $(self.selector + ' .settings-tooltip').toggle();
    }
  },

  loadSettingsMenu: function() {
    var self = this;

    $(this.selector + ' .settings-btn').click(function() {
      self.events.onSettingsBtnClick(self);
    });

    $(this.selector + ' .settings-tooltip input[name=branching]').on('change', function() {
      self.showThrobber();
      self.artistGraph.updateGraph({
        branching: parseInt(this.value)
      });
      self.artistGraph.buildGraph();
    });

    $(this.selector + ' .settings-tooltip input[name=depth]').on('change', function() {
      self.showThrobber();
      self.artistGraph.updateGraph({
        depth: parseInt(this.value)
      });
      self.artistGraph.buildGraph();
    });

    $(this.selector + ' .settings-tooltip input[name=treemode]').on('change', function() {
      self.showThrobber();
      self.artistGraph.updateGraph({
        treemode: this.checked
      });
      self.artistGraph.buildGraph();
    });
  },

  currentArtist: {
    load: function(self, callback) {
      models.player.load('track').done(function(player) {
        callback(self, models.Artist.fromURI(player.track.artists[0].uri),
          player.track.advertisement);
      });
    }
  },

  /**
    Set artist from the current playing track.
    Also creates the artistGraph.
  */
  setArtistGraph: function(self, artist) {

    self.artistGraph = new artistGraph.ArtistGraph({
        depth: 2,
        branching: 4
      },
      $(self.selector + ' .graph')[0],
      artist,
      self.options
    );

    self.showThrobber();
    self.artistGraph.buildGraph();
  },
  showThrobber: function() {
    if (this.artistGraph.throbber)
      this.artistGraph.throbber.hide();

    this.artistGraph.throbber = Throbber.forElement(document.getElementById(this.viewId));
    this.artistGraph.throbber.setPosition('center', 'center');
  }
};

NowPlaying.prototype.contructor = NowPlaying;

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