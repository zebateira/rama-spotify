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
      var controller = this;

      _.each(settings.inputs, function(input) { // TODO remove controller
        $(input.selector).on('change', function() {
          var config = {};
          config[this.name] = parseInt(this[input.value]) || this[input.value];
          controller.showThrobber();
          controller.artistGraph.updateGraph(config);
          controller.artistGraph.buildGraph();
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

      this.bindAllEvents();
    },
    showThrobber: function() {
      if (this.artistGraph.throbber)
        this.artistGraph.throbber.hide();

      this.artistGraph.throbber =
        Throbber.forElement(document.getElementById(this.name));
      this.artistGraph.throbber.setPosition('center', 'center');
      this.artistGraph.throbber._addBackground();
    },
    bindAllEvents: function() {
      _.bindAll(this,
        'onNodeDoubleClick',
        'onPlayerChange');

      this.artistGraph.on('doubleClick', this.onNodeDoubleClick);

      var onPlayerChange = this.onPlayerChange;
      models.player.addEventListener('change', function(player) {
        models.player.load('track').done(onPlayerChange);
      });
    },
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
    onNodeDoubleClick: function(data) {
      var node = _.findWhere(this.artistGraph.data.nodes, {
        id: parseInt(data.nodes[0])
      });

      if (!node || node.id === 1)
        return;

      node.artist.load('compilations').done(function(artist) {
        models.player.playContext(artist.compilations);
      });
    }
  });

  exports.graphcontroller = GraphController;
});