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
      if (this.artistgraph) {
        this.artistgraph.redrawGraph();

        if (this.artistgraph.throbber)
          this.artistgraph.throbber.setPosition('center', 'center');
      }
    },

    /**
      Set artist from the current playing track.
      Creates this.artistgraph object.

      The parameter artist (if defined) is used as the root node.
      Otherwise, the this.nowplayingArtist is used.
    */
    newGraph: function(artist) {
      var config = {
        options: this.options
      };

      // if the artistGraph object as already been defined
      // then use the previous settings
      if (this.artistgraph) {
        config.branching = this.artistgraph.branching;
        config.depth = this.artistgraph.depth;
        config.treemode = this.artistgraph.treemode;
      }

      this.artistgraph = new ArtistGraph(
        this.element,
        artist,
        config
      );

      this.showThrobber();
      this.artistgraph.buildGraph(
        this.hideThrobber.bind(this)
      );

      this.bindAllEvents();
    },
    // Updates the graph given the new config values
    updateGraph: function(config) {
      this.showThrobber();
      this.artistgraph.updateGraph(config,
        this.hideThrobber.bind(this)
      );
    },
    // Updates graph's data (nodes and edges)
    updateData: function() {
      this.artistgraph.updateData();
    },
    getData: function() {
      return this.artistgraph.data;
    },
    // Expands the specific given artist in the graph.
    // the artist is required to be in the graph
    expandNode: function(artist) {
      this.artistgraph.highlightNode(artist);
      this.artistgraph.expandNode(
        0,
        artist,
        this.updateData.bind(this)
      );
    },
    // Displays a loading throbber and hides the graph canvas
    showThrobber: function() {
      if (this.throbber) {
        this.throbber.hide();
        this.throbber.show();
      } else
        this.throbber =
          Throbber.forElement(document.getElementById(this.name));

      this.throbber.setPosition('center', 'center');
      this.throbber._addBackground();
    },
    hideThrobber: function() {
      if (this.throbber)
        this.throbber.hide();
    },

    // Events

    // Binds all the events related to the graph components.
    bindAllEvents: function() {

      this.addGraphEvent('doubleClick',
        this.onNodeDoubleClick.bind(this));

      var onPlayerChange = this.onPlayerChange.bind(this);
      models.player.addEventListener('change', function(player) {
        models.player.load('track').done(onPlayerChange);
      });

      _.each(this.events, function(event) {
        this.artistgraph.on(event.eventName, event.eventHandler);
      }, this);

      _.each(this.graphevents, function(event) {
        this.artistgraph.onGraph(event.eventName, event.eventHandler);
      }, this);
    },
    // Adds eventName to the ArtistGraph object given eventHandler,
    // as a graph event.
    addGraphEvent: function(eventName, eventHandler) {
      this.artistgraph.onGraph(eventName, eventHandler);

      this.graphevents.push({
        eventName: eventName,
        eventHandler: eventHandler
      });
    },

    // Adds eventName to the ArtistGraph object given eventHandler,
    // as a custom event. The event should be run by ArtistGraph
    // accordingly.
    addCustomGraphEvent: function(eventName, eventHandler) {
      if (this.artistgraph)
        this.artistgraph.on(eventName, eventHandler);

      this.events.push({
        eventName: eventName,
        eventHandler: eventHandler
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
      var node = _.findWhere(this.artistgraph.data.nodes, {
        id: parseInt(data.nodes[0])
      });

      // ignore event if it's the same artist
      if (!node || this.nowplayingArtist.uri === node.artist.uri)
        return;

      // play top list tracks from artist.
      node.artist.load('compilations').done(function(artist) {
        models.player.playContext(artist.compilations);
      });
    }

  });

  exports.graphcontroller = GraphController;
});