require([
  'js/controllers/controller#controller',
  '$api/models',
  '$views/throbber#Throbber',
  'js/models/artistgraph#ArtistGraph'
], function(
  Controller,
  models,
  Throbber,
  ArtistGraph) {

  /** 
    Controller for the Graph UI component

    Extends the controllers.Controller generic class
  */

  var GraphController = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.options = config.options;

      // Graph's component specific events
      this.events = [];
      // vis.Graph's events
      this.graphevents = [];
    }
  });

  GraphController.implement({
    // parameter settings is a dependency.
    // this means that at this point (when loadController runs)
    // the settings' DOM element will be done loading
    loadController: function(settings) {

      models.player.load('track')
        .done(this, function(player) {
          this.nowplayingArtist = player.track.artists[0];
          this.setArtistGraph(this.nowplayingArtist);
        });
      var controller = this;

      _.each(settings.inputs, function(input) {
        $(input.selector).on('change', function() {
          var config = {};

          config[this.name] =
            parseInt(this[input.value]) || this[input.value];
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
    setArtistGraph: function(artist) {
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
        artist || this.nowplayingArtist,
        config
      );

      this.showThrobber();
      this.artistGraph.buildGraph();

      this.bindAllEvents();
    },
    updateData: function() {
      this.artistGraph.updateData();
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
      this.artistGraph.onGraph('doubleClick',
        this.onNodeDoubleClick.bind(this));

      var onPlayerChange = this.onPlayerChange.bind(this);
      models.player.addEventListener('change', function(player) {
        models.player.load('track').done(onPlayerChange);
      });

      var artistgraph = this.artistGraph;

      _.each(this.events, function(event) {
        artistgraph.on(event.eventName, event.eventHandler);
      });

      _.each(this.graphevents, function(event) {
        artistgraph.onGraph(event.eventName, event.eventHandler);
      });
    },
    onPlayerChange: function(player) {

      if (player.track.advertisement)
        return;

      this.nowplayingArtist = player.track.artists[0];
    },
    onNodeDoubleClick: function(data) {
      var node = _.findWhere(this.artistGraph.data.nodes, {
        id: parseInt(data.nodes[0])
      });

      if (!node || node.id === 1 ||
        this.nowplayingArtist.uri === node.artist.uri)
        return;

      node.artist.load('compilations').done(function(artist) {
        models.player.playContext(artist.compilations);
      });
    },
    addGraphEvent: function(eventName, eventHandler) {
      this.artistGraph.onGraph(eventName, eventHandler);

      this.graphevents.push({
        eventName: eventName,
        eventHandler: eventHandler
      });
    },
    addCustomGraphEvent: function(eventName, eventHandler) {
      if (this.artistGraph)
        this.artistGraph.on(eventName, eventHandler);

      this.events.push({
        eventName: eventName,
        eventHandler: eventHandler
      });
    }
  });

  exports.graphcontroller = GraphController;
});