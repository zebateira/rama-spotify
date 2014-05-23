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
          this.newGraph(this.nowplayingArtist);
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
    newGraph: function(artist) {
      var config = {
        options: this.options
      };

      // if the artistGraph object as already been defined
      // then use the previous settings
      if (this.artistGraph) {
        config.branching = this.artistGraph.branching;
        config.depth = this.artistGraph.depth;
        config.treemode = this.artistGraph.treemode;
      }

      this.artistGraph = new ArtistGraph(
        this.element,
        artist,
        config
      );

      this.showThrobber();
      this.artistGraph.buildGraph();

      this.bindAllEvents();
    },
    // Updates the graph given the new config values
    updateGraph: function(config) {
      this.showThrobber();
      this.artistGraph.updateGraph(config);
    },
    // Updates graph's data (nodes and edges)
    updateData: function() {
      this.artistGraph.updateData();
    },
    expandNode: function(artist) {
      this.artistGraph.constructGraph(
        0,
        artist,
        this.updateData.bind(this)
      );
    },
    // Displays a loading throbber and hides the graph canvas
    showThrobber: function() {
      if (this.artistGraph.throbber)
        this.artistGraph.throbber.hide();

      this.artistGraph.throbber =
        Throbber.forElement(document.getElementById(this.name));
      this.artistGraph.throbber.setPosition('center', 'center');
      this.artistGraph.throbber._addBackground();
    },

    // Binds all the events related to the graph components.
    bindAllEvents: function() {

      this.addGraphEvent('doubleClick',
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

    // When the player changes the playing track,
    // update this.nowplayingArtist with the track's artist.
    onPlayerChange: function(player) {

      // ignore change if it's playing an ad.
      if (player.track.advertisement)
        return;

      this.nowplayingArtist = player.track.artists[0];
    },

    // Event for double clicking a graph node
    onNodeDoubleClick: function(data) {

      // find the clicked node.
      var node = _.findWhere(this.artistGraph.data.nodes, {
        id: parseInt(data.nodes[0])
      });

      // ignore event if it's the same artist
      if (!node || this.nowplayingArtist.uri === node.artist.uri)
        return;

      // play top list tracks from artist.
      node.artist.load('compilations').done(function(artist) {
        models.player.playContext(artist.compilations);
      });
    },

    // Adds eventName to the ArtistGraph object given eventHandler,
    // as a graph event.
    addGraphEvent: function(eventName, eventHandler) {
      this.artistGraph.onGraph(eventName, eventHandler);

      this.graphevents.push({
        eventName: eventName,
        eventHandler: eventHandler
      });
    },

    // Adds eventName to the ArtistGraph object given eventHandler,
    // as a custom event. The event should be run by ArtistGraph
    // accordingly.
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