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
        background: '#474747',
        border: '#555'
      },
      fontColor: '#ddd',
      fontFace: '',
      shape: 'box',
      radius: 1
    },
    edges: {
      color: {
        color: '#8f9096',
        highlight: '#8f9096'
      }
    },
    stabilize: true
    // clustering: true
  };
};

NowPlaying.prototype = {
  currentArtist: {
    load: function(self, callback) {
      models.player.load('track').done(function(player) {
        callback(self,
          models.Artist.fromURI(player.track.artists[0].uri),
          player.track.advertisement);
      });
    }
  },
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
    if (this.artistGraph) {
      this.artistGraph.redraw();
      if (this.artistGraph.throbber)
        this.artistGraph.throbber.setPosition('center', 'center');
    }
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
    },
    onNodeDoubleClick: function(self, data) {
      var node = _.findWhere(self.artistGraph.data.nodes, {
        id: parseInt(data.nodes[0])
      });

      if (node.id === 1)
        return;

      node.artist.load('compilations').done(function(artist) {
        models.player.playContext(artist.compilations);
      });
    }
  },

  loadSettingsMenu: function() {
    var self = this;

    this.settings = new Settings({
      selector: this.selector + ' ' + '.settings'
    });

    this.settings.loadView([

      function onChangeValue(input, value) {
        var config = {};
        config[input] = parseInt(value) || value;

        self.showThrobber();
        self.artistGraph.updateGraph(config);
        self.artistGraph.buildGraph();
      }
    ]);
  },

  /**
    Set artist from the current playing track.
    Creates the artistGraph.
  */
  setArtistGraph: function(self, artist) {
    var config = {
      options: self.options
    };

    if (self.artistGraph) {
      config.branching = self.artistGraph.branching;
      config.depth = self.artistGraph.depth;
      config.treemode = self.artistGraph.treemode;
    }

    self.artistGraph = new ArtistGraph(
      $(self.selector + ' .graph')[0],
      artist,
      config
    );

    self.showThrobber();
    self.artistGraph.buildGraph();
    self.artistGraph.on('doubleClick', function doubleClick(data) {
      self.events.onNodeDoubleClick(self, data);
    });
  },
  showThrobber: function() {
    if (this.artistGraph.throbber)
      this.artistGraph.throbber.hide();

    this.artistGraph.throbber =
      Throbber.forElement(document.getElementById(this.viewId));
    this.artistGraph.throbber.setPosition('center', 'center');
    this.artistGraph.throbber._addBackground();
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