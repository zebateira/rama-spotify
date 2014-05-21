/**
  Artist Graph Model

  Bridge between Spotify's models.Artist model and 
  the vis.Graph object.
*/

var ArtistGraph = function(element, artist, config) {

  // the DOM element where the canvas should be put on
  // to be later on passed to the vis.Graph object
  this.element = element;

  // Spotify's models.Artist object
  this.artist = artist;
  // id of the node to be passed on to the vis.Graph object
  this.artist.nodeid = 1;

  // ArtistGraph Events
  this.events = {};
  // vis.Graph Events
  this.graphevents = {};

  // load branching value from config if present
  // otherwise, load ArtistGraph.DEFAULT_BRANCHING
  this.branching = (config && config.branching) ||
    ArtistGraph.DEFAULT_BRANCHING;
  // load depth value from config if present
  // otherwise, load ArtistGraph.DEFAULT_DEPTH
  this.depth = (config && config.depth) ||
    ArtistGraph.DEFAULT_DEPTH;

  // load treemode value from config if present
  // otherwise, load ArtistGraph.DEFAULT_TREEMODE
  if (config && typeof config.treemode !== 'undefined')
    this.treemode = config.treemode;
  else this.treemode = ArtistGraph.DEFAULT_TREEMODE;

  // options to be passed on to vis.Graph object
  this.options = (config && config.options) ||
    ArtistGraph.DEFAULT_OPTIONS;

  this.initGraph();

  // create the vis.Graph Object
  this.graph =
    new vis.Graph(this.element, this.data, this.options);
};

// Default values to be used to construct the graph
// if no configuration values are specified when
// constructing the ArtistGraph object
ArtistGraph.DEFAULT_BRANCHING = 4;
ArtistGraph.DEFAULT_DEPTH = 2;
ArtistGraph.DEFAULT_TREEMODE = true;
ArtistGraph.DEFAULT_OPTIONS = {};

ArtistGraph.prototype = {

  // initiates state properties of the graph
  initGraph: function() {
    // list of related artist of the main artist of the graph
    this.relatedArtists = [];

    // extra edges that are missing from the graph in treemode form
    this.extraEdges = [];

    // current id value for the vis.Graph's nodes
    this.currentNodeId = 1;

    // data object to be passed on to the vis.Graph object
    this.data = {
      nodes: [{
        id: this.currentNodeId,
        label: this.artist.name,
        fontColor: '#313336', // TODO refactor colors
        color: {
          background: '#dfe0e6',
          highlight: {
            border: '#7fb701'
          }
        },

        // artist and isLeaf are helper properties
        // for future reference
        artist: this.artist,
        // isLeaf simply indicates if the node is a leaf
        // in the graph or not
        isLeaf: false
      }],
      edges: []
    };
  },

  // alias to initGraph
  reset: function() {
    this.initGraph();
  },

  // Resets state variables and starts constructing the graph
  buildGraph: function() {
    // Current number of iterations (recursive calls)
    // done to construct the graph
    this.currentIterations = 1;

    // Maximum number of iterations that will be performed
    // to construct the graph.
    this.maxIterations =
      (function lambda(i) {
      return Math.pow(this.branching, i) +
        (i < this.depth ? lambda.bind(this)(i + 1) : 0);
    }).bind(this)(0);

    // this.maxIterations is equal to:
    // 
    //   d
    //   ∑ b^i
    //  i=0
    //
    //  which is the sum of the branching value to the power
    //  of i, given that i goes from zero to the depth value.
    //
    //   depth
    //    ___
    //   |
    //    \    
    //    /    branching ^ i
    //   |___
    //   i = 0

    // start constructing the graph recursively
    this.constructGraph(this.depth - 1, this.artist);
  },

  // Constructs the graph by recursively decreasing the depth
  // parameter and using the correct rootArtist on each
  // recursive call
  constructGraph: function(depth, rootArtist) {

    // load the related artists property
    rootArtist.load('related').done(this, function(artist) {
      // when done loading, load the current snapshot of the array
      // of artists, with this.branching length
      artist.related
        .snapshot(0, this.branching).done(this, function(snapshot) {
          // when done loading, load name and uri properties
          // of each artist in the snapshot
          snapshot.loadAll(['name', 'uri'])
          // when done, call forEachRelated on each artist
          .each(this, forEachRelated);
        });
    });

    // Updates the graph given the artist parameter.
    function forEachRelated(artist) {
      // Try to find repeated nodes in the graph
      // given the name of the artist is the same
      var duplicated = _.findWhere(this.data.nodes, {
        label: artist.name
      });

      // Is the artist node already in the graph?
      // If there is a duplicate and if its not the same one,
      // then create and edge between the two artists:
      // artist and rootArtist
      // 
      // The latter test was added after metadata errors were found:
      // sometimes, an artist would exist itself in the related
      // artists list, which created a edge that went from it to 
      // itself.
      if (duplicated && artist.name !== rootArtist.name) {

        // try to find repeated edges in the graph
        var edgeExists = _.findWhere(this.data.edges, {
          to: duplicated.id,
          from: rootArtist.nodeid
        });
        // find repeated edges (even if inverse)
        var inverseEdgeExists = _.findWhere(this.data.edges, {
          from: duplicated.id,
          to: rootArtist.nodeid
        });

        if (!edgeExists && !inverseEdgeExists) {

          // Create the extra edge.
          var extraEdge = {
            from: rootArtist.nodeid,
            to: duplicated.id,
          };
          this.extraEdges.push(extraEdge);

          // The extra edge concept is related to the treemode of
          // the graph:
          // If treemode is ENABLED, then the extra edges
          // are NOT added to the graph. This causes the graph to
          // have less edges (only one pass through) and therefore 
          // the graph creation algorithm is one of a tree creation
          // algorithm, which, as expected, creates a tree.
          // 
          // Otherwise, if treemode is DISABLED, then all the
          // possible edges will be added to the vis.Graph object,
          // which means that the graph will not be a tree, but
          // one of a graph, with a much higher number of edges

          if (!this.treemode)
            this.data.edges.push(extraEdge);
        }
      }
      // if the node is new/unique to the graph
      else {

        // then add it to the list of nodes
        this.data.nodes.push({
          id: ++this.currentNodeId,
          label: artist.name,
          artist: artist,
          // if the depth value of the graph is zero
          // then this is most definitely a leaf node
          isLeaf: depth <= 0
        });

        // also create the edge to connect the new node to
        // its parent
        this.data.edges.push({
          from: rootArtist.nodeid,
          to: this.currentNodeId
        });

        this.relatedArtists.push(artist);

        artist.nodeid = this.currentNodeId;
      }

      // if a leaf node as not been reached, then continue
      // constructing the graph, now with the current artist
      // as the rootArtist
      if (depth > 0)
        this.constructGraph(depth - 1, artist);

      // Update the number of iterations done and
      // If the number of iterations done is enough to have the
      // full graph constructed, then stop recursion and
      // draw the final graph.
      if (++this.currentIterations === this.maxIterations) {
        this.drawGraph(true);
      }
    }

  },

  // what it says...
  drawGraph: function(debug) {
    // binds all the graph events previously declared to the object.
    this.bindAllGraphEvents();

    // sets the previously computed graph data
    this.graph.setData(this.data, {
      disableStart: true
    });

    // starts the animation to draw the graph
    this.graph.start();

    // updates the UI components that are dependent on the content of
    // the graph
    this.events.update();

    // The Spotify's views.Throbber object was initialized in the
    // controllers.GraphController object to hide the graph canvas
    // while the graph is being computed.
    // Since that at this point the graph is ready to be shown,
    // the throbber can be hidden.
    if (this.throbber)
      this.throbber.hide();

    // Debug information about the graph creation
    if (debug) {
      console.log('#### Stats for ' + this.artist.name);
      console.log('# iterations: ' + this.maxIterations);
      console.log('# nodes: ' + this.data.nodes.length);
      console.log('# edges: ' + this.data.edges.length);
    }

  },

  // Updates the graph with the given config object
  // it is expected that config is defined
  updateGraph: function(config) {
    this.branching = config.branching || this.branching;
    this.depth = config.depth || this.depth;
    this.currentNodeId = 1;

    if (typeof config.treemode != 'undefined')
      this.treemode = config.treemode;

    this.reset();
  },

  // Refresh vis.Graph's data object
  updateData: function() {
    this.graph.setData(this.data);
  },
  redraw: function() {
    this.graph.redraw();
  },

  // Events

  // saves the given event, given the proper eventHandler.
  on: function(event, eventHandler) {
    this.events[event] = eventHandler;
  },

  // saves a vis.Graph event, given the proper eventHandler
  onGraph: function(event, eventHandler) {
    this.graphevents[event] = eventHandler;
  },

  // binds the previously saved vis.Graph's events to the
  // graph object
  bindAllGraphEvents: function() {
    for (var event in this.graphevents) {
      this.graph.on(event, this.graphevents[event]);
    }
  },
};

ArtistGraph.prototype.constructor = ArtistGraph;

// Exports for the spotify's require system
require(['$api/models'], function(_models) {
  exports.ArtistGraph = ArtistGraph;
});