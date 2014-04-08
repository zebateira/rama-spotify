/**
  Now Playing Module.

  Gets current playing artist and draws graph
*/

var models;
var Throbber;
var ArtistGraph;
var Settings;


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
      self.currentArtist.load(self,
        function(self, currentArtist, advertisement) {
          var oldArtistURI = self.artistGraph.artist.uri;

          if (advertisement)
            return;

          if (currentArtist.uri !== oldArtistURI)
            self.setArtistGraph(self, currentArtist);
        });
    }
  },

  loadSettingsMenu: function() {
    var self = this;

    this.settings = new Settings({
      selector: this.selector + ' ' + '.settings'
    });

    this.settings.loadView(function() {

      self.settings.onChangeValue(function(input, value) {
        var config = {};

        config[input] = parseInt(value) || value;

        self.showThrobber();
        self.artistGraph.updateGraph(config);
        self.artistGraph.buildGraph();
      });
    });

  },

  currentArtist: {
    load: function(self, callback) {
      models.player.load('track').done(function(player) {
        callback(self,
          models.Artist.fromURI(player.track.artists[0].uri),
          player.track.advertisement);
      });
    }
  },

  /**
    Set artist from the current playing track.
    Also creates the artistGraph.
  */
  setArtistGraph: function(self, artist) {

    self.artistGraph = new ArtistGraph(
      $(self.selector + ' .graph')[0],
      artist, {
        options: self.options
      }
    );

    self.showThrobber();
    self.artistGraph.buildGraph();
  },
  showThrobber: function() {
    if (this.artistGraph.throbber)
      this.artistGraph.throbber.hide();

    this.artistGraph.throbber =
      Throbber.forElement(document.getElementById(this.viewId));
    this.artistGraph.throbber.setPosition('center', 'center');
  }
};

NowPlaying.prototype.contructor = NowPlaying;

require([
  '$api/models',
  '$views/throbber#Throbber',
  'js/models/artistgraph#ArtistGraph',
  'js/components/settings#Settings'
], function(_models, _throbber, _artistGraph, _settings) {

  models = _models;
  Throbber = _throbber;
  ArtistGraph = _artistGraph;
  Settings = _settings;

  exports.NowPlaying = NowPlaying;
});