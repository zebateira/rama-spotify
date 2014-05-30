describe('Artist Graph Module', function() {

  describe('new ArtistGraph', function() {
    it('should set branching factor do default if not specified', function() {

      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi'
        }
      );

      expect(ag.branching).toBe(ArtistGraph.DEFAULT_BRANCHING);
    });

    it('should set depth value do default if not specified', function() {

      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi'
        }
      );

      expect(ag.depth).toBe(ArtistGraph.DEFAULT_DEPTH);
    });

    it('should set branching factor for graph', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi'
        }, {
          branching: 20
        }
      );

      expect(ag.branching).toBe(20);
    });

    it('should set depth factor for graph', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi'
        }, {
          depth: 2
        }
      );

      expect(ag.depth).toBe(2);
    });
  });

  describe('build Graph', function() {
    it('should create 7 nodes with b=2 and d=2', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }, {
          depth: 2,
          branching: 2
        }
      );

      expect(ag.calNumNodes(ag.depth, ag.branching)).toBe(7);
    });

    it('should build a graph with 7 nodes and 6 edges given depth 2 and branching 2', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }, {
          depth: 2,
          branching: 2
        }
      );

      ag.buildGraph(function() {
        expect(ag.graph.nodesData.getIds().length)
          .toBe(7);
        expect(ag.graph.edgesData.getIds().length).toBe(6);
      });

    });
  });
});