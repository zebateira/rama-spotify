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
  this.branching = config.branching || this.DEFAULT_BRANCHING;
  this.depth = config.depth || this.DEFAULT_DEPTH;

  this.relatedArtists = [];

  // numbering for the id's of adjacent nodes
  this.index = 1;

  // data of the graph: should contain nodes and edges
  this.data = {
    nodes: [{
      id: this.index,
      label: this.artist.name
    }],
    edges: []
  };
  // options for the rendering of the graph
  this.options = options;

  this.graph = new vis.Graph(this.element, this.data, this.options);
};

ArtistGraph.prototype = {

  buildGraph: function() {
    this.artist.nodeid = 1;

    return this.constructGraph(this.depth, this.artist);
  },

  constructGraph: function(it, rootArtist, promise) {
    if (it <= 0) {
      return promise;
    }

    var forEachRelated = function(artist) {
      var duplicated = _.where(this.data.nodes, {
        label: artist.name
      });

      if (duplicated.length > 0) {
        // add edges to previous added nodes
      } else {
        this.data.nodes.push({
          id: ++this.index,
          label: artist.name
        });

        this.data.edges.push({
          from: rootArtist.nodeid,
          to: this.index
        });

        this.relatedArtists.push(artist);

        artist.nodeid = this.index;
      }

      promise = models.Promise.join(promise, this.constructGraph(--it, artist, promise));
    };

    var relatedSnapshotDone = function(snapshot) {
      var snapshotLoadAll = snapshot.loadAll(['name', 'uri']);
      promise = models.Promise.join(promise, snapshotLoadAll);
      snapshotLoadAll.each(this, forEachRelated);
    };

    var relatedDone = function(artist) {
      var promiseRelatedSnapshot = artist.related.snapshot(0, this.branching);
      promise = models.Promise.join(promise, promiseRelatedSnapshot);
      promiseRelatedSnapshot.done(this, relatedSnapshotDone);
    };

    var promiseRelated = rootArtist.load('related');
    promise = (promise ? models.Promise.join(promise, promiseRelated) : promiseRelated);
    promiseRelated.done(this, relatedDone);

    return promise;
  },
  draw: function() {
    this.graph.setData(this.data, {
      disableStart: true
    });

    console.log(this.data);
    this.graph.start();
    this.graph.zoomExtent();
  },

  redraw: function() {
    this.graph.redraw();
    this.graph.zoomExtent();
  }
};

ArtistGraph.prototype.constructor = ArtistGraph;


require(['$api/models'], function(_models) {
  models = _models;

  exports.ArtistGraph = ArtistGraph;
});