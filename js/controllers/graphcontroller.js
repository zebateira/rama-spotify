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
    loadController: function() {
      models.player.load('track')
        .done(this, function(player) {

          // this.nowplayingArtist refers to the artist
          // of the current playing track
          this.nowplayingArtist = player.track.artists[0];
          this.setArtistGraph(this.nowplayingArtist);
        });
    },

    // this.updateView
    // Redraws the graph and centers the throbber if being shown.
    // This is useful when the window is being resized and
    // the throbbers is not aligned at the center of the screen.
    updateView: function() {
      if (this.artistGraph) {
        this.artistGraph.redraw();

        if (this.artistGraph.throbber)
          this.artistGraph.throbber.setPosition('center', 'center');
      }
    },

    /**
      Set artist from the current playing track.
      Creates this.artistGraph object.

      The parameter artist (if defined) is used as the root node.
      Otherwise, the this.nowplayingArtist is used.
    */
    setArtistGraph: function(artist) {
      var options = {
        options: this.options
      };

      if (this.artistGraph) {
        options.branching = this.artistGraph.branching;
        options.depth = this.artistGraph.depth;
        options.treemode = this.artistGraph.treemode;
      }

      this.artistGraph = new ArtistGraph(
        this.element,
        artist || this.nowplayingArtist,
        options
      );

      this.showThrobber();
      this.artistGraph.buildGraph();

      this.bindAllEvents();
    },
    updateGraph: function(config) {
      this.showThrobber();
      this.artistGraph.updateGraph(config);
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