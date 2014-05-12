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
      this.externalevents = [];
      this.externalCustomEvents = [];
    }
  });

  GraphController.implement({
    afterLoad: function(settings) {

      models.player.load('track')
        .done(this, function(player) {
          this.nowplayingArtist = player.track.artists[0];
          this.setArtistGraph(player);
        });
      var controller = this;

      _.each(settings.inputs, function(input) {
        // TODO remove controller
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
    setArtistGraph: function(player) {
      var config = {
        options: this.options
      };

      if (this.artistGraph) {
        config.branching = this.artistGraph.branching;
        config.depth = this.artistGraph.depth;
        config.treemode = this.artistGraph.treemode;
      }

      this.artist = player.track.artists[0];

      this.artistGraph = new ArtistGraph(
        this.element,
        player.track.artists[0],
        config
      );

      this.showThrobber();
      this.artistGraph.buildGraph();

      this.bindAllEvents();
    },
    updateArtist: function(artist) {
      var config = {
        options: this.options
      };

      config.branching = this.artistGraph.branching;
      config.depth = this.artistGraph.depth;
      config.treemode = this.artistGraph.treemode;

      this.artist = artist;
      this.artistGraph = new ArtistGraph(
        this.element,
        artist,
        config
      );

      this.showThrobber();
      this.artistGraph.buildGraph();

      this.bindAllEvents();
    },
    updateGraph: function() {
      var config = {
        options: this.options
      };

      config.branching = this.artistGraph.branching;
      config.depth = this.artistGraph.depth;
      config.treemode = this.artistGraph.treemode;

      this.artistGraph = new ArtistGraph(
        this.element,
        this.artist,
        config
      );

      this.showThrobber();
      this.artistGraph.buildGraph();

      this.bindAllEvents();
    },
    updateData: function() {
      this.artistGraph.graph.setData(this.artistGraph.data);
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
      this.artistGraph.on('doubleClick',
        this.onNodeDoubleClick.bind(this));

      var onPlayerChange = this.onPlayerChange.bind(this);
      models.player.addEventListener('change', function(player) {
        models.player.load('track').done(onPlayerChange);
      });

      var graph = this.artistGraph;

      _.each(this.externalevents, function(event) {
        graph.on(event.eventName, event.eventHandler);
      });

      _.each(this.externalCustomEvents, function(event) {
        graph.onCustomEvent(event.eventName, event.eventHandler);
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
      this.artistGraph.on(eventName, eventHandler);

      this.externalevents.push({
        eventName: eventName,
        eventHandler: eventHandler
      });
    },
    addCustomGraphEvent: function(eventName, eventHandler) {
      if (this.artistGraph)
        this.artistGraph.onCustomEvent(eventName, eventHandler);

      this.externalCustomEvents.push({
        eventName: eventName,
        eventHandler: eventHandler
      });
    }
  });

  exports.graphcontroller = GraphController;
});