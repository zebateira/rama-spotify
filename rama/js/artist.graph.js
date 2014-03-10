/**
  Defines the artist.graph model

  Exports the ArtistGraph object to draw a graph of related artists in a DOM element
*/

require(['$api/models'], function(models) {

  var ArtistGraph = function(artist, options) {

    this.artist = artist;

    // numbering for the id's of adjacent nodes
    this.index = 1;

    this.nodes = [{
      id: this.index,
      label: this.artist.name
    }];
    this.edges = [];

    // data of the graph: contains nodes and edges
    this.data = {
      nodes: this.nodes,
      edges: this.edges
    };
    // options for the rendering of the graph
    this.options = options;

    this.drawGraph = function(element) {
      var self = this;

      this.graph = new vis.Graph(element, this.data, this.options);

      this.artist.load('related').done(function(artist) {
        artist.related.snapshot().done(function(snapshot) {

          snapshot.loadAll('name').each(function(artist) {
            self.data.nodes.push({
              id: ++self.index,
              label: artist.name
            });

            self.data.edges.push({
              from: 1,
              to: self.index
            });

            self.graph.setData(self.data);
          });

        });
      });

      return this;
    };

    this.addNode = function(node) {
      // todo
    };

    this.addEdge = function(egde) {
      // todo
    };

    this.redraw = function() {
      // todo
    };
  };

  exports.ArtistGraph = ArtistGraph;
});