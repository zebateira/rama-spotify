/**
  Defines the artist graph model

  The ArtistGraph object Draws a graph of related artists
  in a DOM element given a music artist and 
  some optional configuration values.
*/

var ArtistGraph = function(element, artist, config) {

  this.element = element;
  this.artist = artist;
  this.artist.nodeid = 1;

  this.events = {};

  this.branching = (config && config.branching) ||
    ArtistGraph.DEFAULT_BRANCHING;
  this.depth = (config && config.depth) || ArtistGraph.DEFAULT_DEPTH;

  if (config && typeof config.treemode !== 'undefined')
    this.treemode = config.treemode;
  else this.treemode = ArtistGraph.DEFAULT_TREEMODE;

  this.options = (config && config.options) || ArtistGraph.DEFAULT_OPTIONS;

  this.initGraph();

  this.graph = new vis.Graph(this.element, this.data, this.options);

  var graph = this.graph;
  this.graph.on('stabilized', function(iterations) { // Y U NO WORK
    graph.zoomExtent();
    console.log(iterations);
  });
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
        fontColor: '#313336',
        color: {
          background: '#afb0b6'
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

  constructGraph: function(depth, rootArtist) {

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
            color: '#aaa'
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
          artist: artist
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

    function relatedSnapshotDone(snapshot) {
      var snapshotLoadAll = snapshot.loadAll(['name', 'uri']);

      snapshotLoadAll.each(this, forEachRelated);
    }

    function relatedDone(artist) {
      var promiseRelatedSnapshot =
        artist.related.snapshot(0, this.branching);
      promiseRelatedSnapshot.done(this, relatedSnapshotDone);
    }

    var promiseRelated = rootArtist.load('related');
    promiseRelated.done(this, relatedDone);
  },
  drawGraph: function(debug) {
    this.graph.setData(this.data, {
      disableStart: true
    });

    this.graph.start();

    this.bindAllEvents();

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
  redraw: function() {
    this.graph.redraw();
  },

  // events
  on: function(event, eventHandler) {
    this.events[event] = eventHandler;
  },

  bindAllEvents: function() {
    var self = this;
    _.each(this.events, function(event) {
      self.graph.on(event.name, function(data) {
        self.events[event.name](data);
      });
    });
  }
};

ArtistGraph.prototype.constructor = ArtistGraph;


// Exports for the spotify's require system
require(['$api/models'], function(_models) {
  exports.ArtistGraph = ArtistGraph;
});