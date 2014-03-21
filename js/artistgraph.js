/**
  Defines the artist.graph model

  Exports the ArtistGraph object to draw a graph of related artists
  in a DOM element given a music artist and some optional options 8D
*/

var models;

function Promise() {
  this.callback = function() {};

  this.done = function(callback) {
    this.callback = callback;
  };
}

var ArtistGraph = function(config, element, artist, options) {
  this.DEFAULT_BRANCHING = 5;
  this.DEFAULT_DEPTH = 4;

  this.element = element;
  this.artist = artist;
  this.artist.nodeid = 1;
  this.branching = config.branching || this.DEFAULT_BRANCHING;
  this.depth = config.depth || this.DEFAULT_DEPTH;

  this.relatedArtists = [];
  this.extraEdges = [];


  // numbering for the id's of adjacent nodes
  this.index = 1;

  // data of the graph: should contain nodes and edges
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
  // options for the rendering of the graph
  this.options = options;

  this.graph = new vis.Graph(this.element, this.data, this.options);
};

ArtistGraph.prototype = {

  buildGraph: function() {
    this.counter = 1;
    this.counter2 = 1;
    this.maxNodes = Math.pow(this.branching, this.depth) + 2 * this.branching;
    console.log(this.maxNodes);
    this.constructGraph(this.depth, this.artist);
  },

  constructGraph: function(depth, rootArtist) {
    console.log('depth:' + depth);

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
          // this.data.edges.push(extraEdge);

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


      this.counter++;
      console.log('c: ' + this.counter);
      console.log('#nodes: ' + this.data.nodes.length);
      // if (this.counter === this.maxNodes)
      this.draw();
    };

    var relatedSnapshotDone = function(snapshot) {
      var snapshotLoadAll = snapshot.loadAll(['name', 'uri'])

      snapshotLoadAll.each(this, forEachRelated).done(this, function(artists) {
        this.counter2 += artists.length;
        console.log('c2: ' + this.counter2);
      });;
    };

    var relatedDone = function(artist) {
      var promiseRelatedSnapshot = artist.related.snapshot(0, this.branching);
      promiseRelatedSnapshot.done(this, relatedSnapshotDone);
    };

    var promiseRelated = rootArtist.load('related');
    promiseRelated.done(this, relatedDone);


  },
  draw: function() {
    this.graph.setData(this.data, {
      disableStart: true
    });
    this.graph.start();
    this.graph.zoomExtent();
    if (this.throbber)
      this.throbber.hide();
  },

  redraw: function() {
    this.draw();
    this.graph.redraw();
  }
};

ArtistGraph.prototype.constructor = ArtistGraph;


require(['$api/models'], function(_models) {
  models = _models;

  exports.ArtistGraph = ArtistGraph;
});