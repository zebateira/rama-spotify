require(['$api/models', '$views/image'], function(models, image) {

  exports.NowPlaying = function() {

    this.drawGraph = function() {

      models.player.load('track').done(function(player) {
        var currentArtist = models.Artist.fromURI(player.track.artists[0].uri);
        var index = 1;
        var nodes = [{
          id: index,
          label: currentArtist.name
        }];
        var edges = [];

        var container = document.getElementById('graph');
        var data = {
          nodes: nodes,
          edges: edges
        };

        var options = {};

        var graph = new vis.Graph(container, data, options);

        currentArtist.load('related').done(function(artist) {
          artist.related.snapshot().done(function(snapshot) {

            snapshot.loadAll('name').each(function(artist) {
              data.nodes.push({
                id: ++index,
                label: artist.name
              });

              data.edges.push({
                from: 1,
                to: index
              });

              graph.setData(data);
            });

          });

        });
      });

    };

    this.load = function() {
      this.drawGraph();
    };

  };
});