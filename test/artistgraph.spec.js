describe('Artist Graph Module', function() {

  describe('new ArtistGraph', function() {
    it('should set branching factor do default if not specified', function() {

      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }
      );

      expect(ag.branching).toBe(ArtistGraph.DEFAULT_BRANCHING);
    });

    it('should set depth value do default if not specified', function() {

      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }
      );

      expect(ag.depth).toBe(ArtistGraph.DEFAULT_DEPTH);
    });

    it('should set branching factor for graph', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }, {
          branching: 20
        }
      );

      expect(ag.branching).toBe(20);
    });

    it('should set depth factor for graph', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }, {
          depth: 2
        }
      );

      expect(ag.depth).toBe(2);
    });
  });

  describe('build Graph', function() {
    it('calcNumNodes(): should give 7 nodes with b=2 and d=2', function() {
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
        expect(ag.getNumNodes()).toBe(7);
        expect(ag.getNumEdges()).toBe(6);
      });
    });

    it('should build a graph with 341 nodes and 340 edges given depth 6 and branching 4', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }, {
          depth: 4,
          branching: 4
        }
      );

      ag.buildGraph(function() {
        expect(ag.getNumNodes()).toBe(341);
        expect(ag.getNumEdges()).toBe(340);
      });
    });

    it('should build a graph with 11 nodes and 10 edges given depth 1 and branching 10', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }, {
          depth: 1,
          branching: 10
        }
      );

      ag.buildGraph(function() {
        expect(ag.getNumNodes()).toBe(11);
        expect(ag.getNumEdges()).toBe(10);
      });
    });
  });

  describe('update depth value', function() {
    it('should update the depth value of the graph and add or remove nodes', function() {
      var ag = new ArtistGraph(
        document.createElement('div'), {
          name: 'Anamanaguchi',
          uri: 'spotify:artist:2UwJRAgSOi1zcLkvUNc8XL'
        }, {
          depth: 2,
          branching: 4
        }
      );

      ag.buildGraph(function() {
        expect(ag.getNumNodes()).toBe(21);
        expect(ag.getNumEdges()).toBe(20);
      });

      ag.updateDepth(3);
      expect(ag.getNumNodes()).toBe(85);
      expect(ag.getNumEdges()).toBe(84);


      ag.updateDepth(1);
      expect(ag.getNumNodes()).toBe(5);
      expect(ag.getNumEdges()).toBe(4);


    });

    it('should remove the extra edges (tree mode enabled) to the graph', function() {
      expect(true).toBe(false);
    });
  });
});