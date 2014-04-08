/**
  Defines the artist graph model

  The ArtistGraph object Draws a graph of related artists
  in a DOM element given a music artist and some optional config values.
*/

var ArtistGraph = function(element, artist, config) {

  this.element = element;
  this.artist = artist;
  this.artist.nodeid = 1;


  this.branching = (config && config.branching) || ArtistGraph.DEFAULT_BRANCHING;
  this.depth = (config && config.depth) || ArtistGraph.DEFAULT_DEPTH;
  this.options = (config && config.options) || ArtistGraph.DEFAULT_OPTIONS;


  this.treemode = true;

  // options for rendering the graph

  this.resetGraph();

  this.graph = new vis.Graph(this.element, this.data, this.options);

  this.graph.on('stabilized', function(iterations) { // Y U NO WORK
    this.zoomExtent();
    console.log(iterations);
  });
};

ArtistGraph.DEFAULT_BRANCHING = 4;
ArtistGraph.DEFAULT_DEPTH = 2;
ArtistGraph.DEFAULT_OPTIONS = {

};

ArtistGraph.prototype = {

  buildGraph: function() {
    this.counter = 1;

    this.maxNodes = 0;
    for (var i = 0; i <= this.depth; ++i) {
      this.maxNodes += Math.pow(this.branching, i);
    }

    this.constructGraph(this.depth - 1, this.artist);
  },

  constructGraph: function(depth, rootArtist) {

    var forEachRelated = function(artist) {
      var duplicated = _.findWhere(this.data.nodes, {
        label: artist.name
      });

      if (duplicated) {
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
            color: '#ddd'
          };

          this.extraEdges.push(extraEdge);

          if (!this.treemode)
            this.data.edges.push(extraEdge);
        }
      } else {
        var nodeid = ++this.index;

        this.data.nodes.push({
          id: nodeid,
          label: artist.name
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
    };

    var relatedSnapshotDone = function(snapshot) {
      var snapshotLoadAll = snapshot.loadAll(['name', 'uri']);

      snapshotLoadAll.each(this, forEachRelated);
    };

    var relatedDone = function(artist) {
      var promiseRelatedSnapshot =
        artist.related.snapshot(0, this.branching);
      promiseRelatedSnapshot.done(this, relatedSnapshotDone);
    };

    var promiseRelated = rootArtist.load('related');
    promiseRelated.done(this, relatedDone);
  },

  drawGraph: function(debug) {

    this.graph.setData(this.data, {
      disableStart: true
    });

    this.graph.start();

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

    this.resetGraph();
  },
  resetGraph: function() {
    this.relatedArtists = [];
    this.extraEdges = [];
    this.index = 1;
    this.data = {
      nodes: [{
        id: this.index,
        label: this.artist.name,
        color: {
          background: '#666'
        }
      }],
      edges: []
    };
  },
  redraw: function() {
    this.graph.zoomExtent();
    this.graph.redraw();
  }
};

ArtistGraph.prototype.constructor = ArtistGraph;


// Exports for the spotify's require system
require(['$api/models'], function(_models) {
  exports.ArtistGraph = ArtistGraph;
});