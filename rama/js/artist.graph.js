/**
  Defines the artist.graph model

  Exports the ArtistGraph object to draw a graph of related artists
  in a DOM element given a music artist and some optional options 8D
*/

require(['$api/models'], function(models) {

  function Promise() {
    this.callback = function() {};

    this.done = function(callback) {
      this.callback = callback;
    };
  }

  function ArtistGraph(element, artist, options) {
    this.artist = artist;

    this.element = element;

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
  }

  ArtistGraph.prototype = {

    setupGraph: function() {
      var promise = new Promise();

      this.artist.load('related').done(this, function(artist) {
        artist.related.snapshot().done(this, function(snapshot) {
          snapshot.loadAll('name', 'uri').each(this, function(artist) {

            this.relatedArtists.push(
              models.Artist.fromURI(artist.uri)
            );

            this.data.nodes.push({
              id: ++this.index,
              label: artist.name
            });

            this.data.edges.push({
              from: 1,
              to: this.index
            });
          }).done(this, function() {
            this.graph.setData(this.data, {
              disableStart: true
            });
            promise.callback();
          });
        });
      });

      return promise;
    },
    draw: function() {
      this.graph.start();
    },

    redraw: function() {
      this.graph.redraw();
      this.graph.zoomExtent();

      return this;
    }
  };


  exports.ArtistGraph = ArtistGraph;
});