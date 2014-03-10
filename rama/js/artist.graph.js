require(['$api/models'], function(models) {

  var ArtistGraph = {
    // numbering for the id's of adjacent nodes
    index: 1,
    nodes: [],
    edges: [],
    data: {},
    options: {},

    init: function(artist, options) {
      this.artist = artist;

      this.index = 1;
      this.nodes = [{
        id: this.index,
        label: this.artist.name
      }];
      this.edges = [];

      this.data = {
        nodes: this.nodes,
        edges: this.edges
      };
      this.options = options;

      return this;
    },

    drawGraph: function(element) {
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
    },

    addNode: function(node) {
      // todo
    },
    addEdge: function(egde) {
      // todo
    },

    redraw: function() {
      // todo
    }
  };

  exports.ArtistGraph = ArtistGraph;
});