require([
  'js/controllers/controller#controller',
  '$api/models',
  '$views/throbber#Throbber',
  'js/models/artistgraph#ArtistGraph',
  'js/models/element#element'
], function(Controller, models, Throbber, ArtistGraph, Element) {

  var GraphController = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.options = config.options;
    }
  });

  GraphController.implement({
    afterLoad: function(settings) {

      models.player.load('track')
        .done(this, this.setArtistGraph);
      var self = this;

      _.each(settings.inputs, function(input) {
        $(input.selector).on('change', function() {
          var config = {};
          config[this.name] = parseInt(this[input.value]) || this[input.value];
          self.showThrobber();
          self.artistGraph.updateGraph(config);
          self.artistGraph.buildGraph();
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
      onPlayerChange: function(player) { // TODO refactor same artist verification
        if (!this.artistGraph)
          this.setArtistGraph(player);

        if (player.track.advertisement)
          return;

        var oldArtistURI = this.artistGraph.artist.uri;

        if (player.track.artists[0].uri !== oldArtistURI) {
          this.setArtistGraph(player);
        }
      },
      onNodeDoubleClick: function(self, data) {
        var node = _.findWhere(self.artistGraph.data.nodes, {
          id: parseInt(data.nodes[0])
        });

        if (!node || node.id === 1)
          return;

        node.artist.load('compilations').done(function(artist) {
          models.player.playContext(artist.compilations);
        });
      }
    },

    /**
      Set artist from the current playing track.
      Creates the artistGraph.
    */
    setArtistGraph: function(player) {
      var config = {
        options: this.options
      };

      if (this.artistGraph) {
        config.branching = this.artistGraph.branching;
        config.depth = this.artistGraph.depth;
        config.treemode = this.artistGraph.treemode;
      }

      this.artistGraph = new ArtistGraph(
        this.element,
        player.track.artists[0],
        config
      );

      this.showThrobber();
      this.artistGraph.buildGraph();

      var graphcontroller = this;
      this.artistGraph.on('doubleClick', function doubleClick(data) {
        graphcontroller.events.onNodeDoubleClick(graphcontroller, data);
      });
    },
    showThrobber: function() {
      if (this.artistGraph.throbber)
        this.artistGraph.throbber.hide();

      this.artistGraph.throbber =
        Throbber.forElement(document.getElementById(this.name));
      this.artistGraph.throbber.setPosition('center', 'center');
      this.artistGraph.throbber._addBackground();
    }
  });

  exports.graphcontroller = GraphController;
});