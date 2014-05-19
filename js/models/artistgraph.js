/**
  Artist Graph Model

  Bridge between the artist model and the vis.Graph object.
*/

var ArtistGraph = function(element, artist, config) {

  // the DOM element where the canvas should be put
  // to be passed on to the vis.Graph object
  this.element = element;

  // spotify's models.Artist object
  this.artist = artist;
  // id of the node to be passed on to the vis.Graph object
  this.artist.nodeid = 1;

  // ArtistGraph Events
  this.events = {};
  // vis.Graph Events
  this.graphEvents = {};

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

  this.graph =
    new vis.Graph(this.element, this.data, this.options);

  var graph = this.graph;
};

ArtistGraph.DEFAULT_BRANCHING = 4;
ArtistGraph.DEFAULT_DEPTH = 2;
ArtistGraph.DEFAULT_TREEMODE = true;
ArtistGraph.DEFAULT_OPTIONS = {};

ArtistGraph.prototype = {
  initGraph: function() {
    this.relatedArtists = [];
    this.extraEdges = [];
    this.index = 1;
    this.data = {
      nodes: [{
        id: this.index,
        label: this.artist.name,
        artist: this.artist,
        isLeaf: false,
        fontColor: '#313336',
        color: {
          background: '#dfe0e6',
          highlight: {
            border: '#7fb701'
          }
        }
      }],
      edges: []
    };
  },
  reset: function() {
    this.initGraph();
  },
  buildGraph: function() {
    this.counter = 1;

    this.maxNodes = 0;
    for (var i = 0; i <= this.depth; ++i) {
      this.maxNodes += Math.pow(this.branching, i);
    }

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
    // 
    function forEachRelated(artist) {
      var duplicated = _.findWhere(this.data.nodes, {
        label: artist.name
      });

      if (duplicated && artist.name !== rootArtist.name) {
        var inverseEdgeExists = _.findWhere(this.data.edges, {
          from: duplicated.id,
          to: rootArtist.nodeid
        });
        var edgeExists = _.findWhere(this.data.edges, {
          to: duplicated.id,
          from: rootArtist.nodeid
        });

        if (!inverseEdgeExists && !edgeExists) {
          var extraEdge = {
            from: rootArtist.nodeid,
            to: duplicated.id,
          };

          this.extraEdges.push(extraEdge);

          if (!this.treemode)
            this.data.edges.push(extraEdge);
        }
      } else {
        var nodeid = ++this.index;

        this.data.nodes.push({
          id: nodeid,
          label: artist.name,
          artist: artist,
          isLeaf: depth <= 0
        });

        this.data.edges.push({
          from: rootArtist.nodeid,
          to: nodeid
        });

        this.relatedArtists.push(artist);

        artist.nodeid = nodeid;
      }

      if (depth > 0)
        this.constructGraph(depth - 1, artist);

      if (++this.counter === this.maxNodes) {
        this.drawGraph(true);
      }
    }



  },
  drawGraph: function(debug) {
    this.bindAllGraphEvents();

    this.graph.setData(this.data, {
      disableStart: true
    });

    this.graph.start();

    this.events.update();

    if (this.throbber)
      this.throbber.hide();

    if (debug) {
      console.log('#### Stats for ' + this.artist.name);
      console.log('# iterations: ' + this.maxNodes);
      console.log('# nodes: ' + this.data.nodes.length);
      console.log('# edges: ' + this.data.edges.length);
    }

  },
  updateGraph: function(config) {
    this.branching = config.branching || this.branching;
    this.depth = config.depth || this.depth;
    this.index = 1;

    if (typeof config.treemode != 'undefined')
      this.treemode = config.treemode;

    this.reset();
  },
  updateData: function() {
    this.graph.setData(this.data);
  },
  redraw: function() {
    this.graph.redraw();
  },

  // events
  onGraph: function(event, eventHandler) {
    this.graphEvents[event] = eventHandler;
  },
  bindAllGraphEvents: function() {
    for (var event in this.graphEvents) {
      this.graph.on(event, this.graphEvents[event]);
    }
  },
  on: function(event, eventHandler) {
    this.events[event] = eventHandler;
  },
};

ArtistGraph.prototype.constructor = ArtistGraph;

// Exports for the spotify's require system
require(['$api/models'], function(_models) {
  exports.ArtistGraph = ArtistGraph;
});