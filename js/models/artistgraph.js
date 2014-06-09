var sputils;

/**
  Artist Graph Model

  Bridge between Spotify's models.Artist model and 
  the vis.Graph object.
*/
var ArtistGraph = function(element, artist, config) {

  // the DOM element where the canvas should be put on
  // to be later on passed to the vis.Graph object
  this.element = element;

  // Spotify's models.Artist object
  this.artist = artist;
  // id of the node to be passed on to the vis.Graph object
  this.artist.nodeid = 1;

  // ArtistGraph Events
  this.events = {};
  // vis.Graph Events
  this.graphevents = {};

  // load configurations
  this.branching = (config && config.branching) ||
    ArtistGraph.DEFAULT_BRANCHING;

  this.depth = (config && config.depth) ||
    ArtistGraph.DEFAULT_DEPTH;

  if (config && typeof config.treemode !== 'undefined')
    this.treemode = config.treemode;
  else this.treemode = ArtistGraph.DEFAULT_TREEMODE;

  // options to be passed on to vis.Graph object
  this.options = (config && config.options) ||
    ArtistGraph.DEFAULT_OPTIONS;


  // create the vis.Graph Object
  this.graph =
    new vis.Graph(this.element, {}, this.options);

  this.initGraph();

  this.bindAllGraphEvents();
};

// Default values to be used to construct the graph
// if no configuration values are specified when
// constructing the ArtistGraph object
ArtistGraph.DEFAULT_BRANCHING = 4;
ArtistGraph.DEFAULT_DEPTH = 2;
ArtistGraph.DEFAULT_TREEMODE = true;
ArtistGraph.DEFAULT_OPTIONS = {};

// ArtistGraph.colors = {
//   node: {
//     border: "white",
//     background: "black",
//     highlight: {
//       border: "white",
//       background: "black"
//     }
//   },
//   edge: {
//     border: "white",
//     background: "black",
//     highlight: {
//       border: "white",
//       background: "black"
//     }
//   }
// };

ArtistGraph.prototype = {

  // initiates state properties of the graph
  initGraph: function() {

    // extra edges that are missing from the graph in treemode form
    this.extraEdges = new vis.DataSet({});

    this.rootNode = {
      // spotify's artist uri string is being used as the nodes' id.
      id: this.artist.uri,
      label: this.artist.name,
      fontColor: '#313336', // TODO refactor colors
      color: {
        background: '#dfe0e6',
        highlight: {
          border: '#7fb701'
        }
      },

      // artist and isLeaf are helper properties
      // for future reference
      artist: this.artist,
      uri: this.artist.uri,
      level: 0,
      isRoot: true
    };

    this.artist.node = this.rootNode;

    this.graph.nodesData.add(this.rootNode);
  },

  // alias to initGraph
  reset: function() {
    this.initGraph();
  },


  // maxIterations is equal to:
  // 
  //   d
  //   ∑ b^i
  //  i=0
  //
  //  which is the sum of the branching value to the power
  //  of i, given that i goes from zero to the depth value.
  //
  //   depth
  //    ___
  //   |
  //    \    
  //    /    branching ^ i
  //   |___
  //   i = 0

  calNumNodes: function(depth, branching) {
    return (function lambda(i) {
      return Math.pow(branching, i) +
        (i < depth ? lambda.bind(this)(i + 1) : 0);
    }).bind(this)(0);
  },

  // Resets state variables and starts constructing the graph
  buildGraph: function(done) {
    // Current number of iterations (recursive calls)
    // done to construct the graph
    var currentIteration = 1;

    // Maximum number of iterations that will be performed
    // to construct the graph.
    this.maxIterations = this.calNumNodes(this.depth, this.branching);


    // start constructing the graph recursively
    this.expandNode(
      this.depth - 1,
      this.artist,
      iterationUpdate.bind(this)
    );

    function iterationUpdate() {
      // Update the number of iterations done and
      currentIteration += this.branching;

      // If the number of iterations done is enough to have the
      // full graph constructed, then stop recursion and
      // call the final callback
      if (currentIteration >= this.maxIterations) {
        if (done) {
          done();
        }
      }
    }
  },

  // Expands the node of the parent artist by this.branching.
  // It recursively decreases the depth parameter.
  // The done parameter is the callback to be called
  // after all the callbacks of the child nodes of the root node
  // have finished.
  expandNode: function(depth, parentArtist, iterationDone) {

    // after expanding, the node will stop being a leaf
    var parentNode = parentArtist.node;

    parentNode.childs = new vis.DataSet({});
    var artistsAdded = 0;

    sputils.loadRelatedArtists(
      parentArtist,
      whenAllDone.bind(this)
    );


    function whenAllDone(childArtists) {
      _.each(childArtists, function(artist) {

        if (artistsAdded < this.branching) {
          forEachRelated.bind(this, artist)();

          if (depth > 0)
            this.expandNode(depth - 1, artist, iterationDone);
        }

      }, this);
    }

    // Updates the graph given the artist parameter.
    // This function will be called on each child node
    // (artist parameter) of the root node.
    // note: this means that this function will be called
    //       exactly this.branching times.
    function forEachRelated(childArtist) {

      // Try to find repeated nodes in the graph
      // given the name of the artist is the same
      var duplicated = this.getNode(childArtist);

      // Is the artist node already in the graph?
      // If there is a duplicate then create an
      // edge between the two artists:
      // the child artist and parent artist
      if (duplicated) {

        // try to find repeated edges in the graph
        var edgeExists =
          this.getEdges(duplicated.id, parentArtist.uri);
        // try to find repeated edges (even if inverse)
        var inverseEdgeExists =
          this.getEdges(parentArtist.uri, duplicated.id);

        // if the edge we are trying to insert 
        // does not exist in the graph yet AND
        // the two nodes connecting the edge are not the same one
        // then insert edge.
        // 
        // The latter test was added after metadata errors were found:
        // sometimes, an artist would exist itself in its related
        // artists list, which created a edge that went from it to 
        // itself.
        if (edgeExists.length === 0 && inverseEdgeExists.length === 0 &&
          childArtist.uri != parentArtist.uri) {

          // Create the extra edge.
          var extraEdge = {
            from: parentArtist.uri,
            to: duplicated.id,
          };
          this.extraEdges.add(extraEdge);

          // The extra edge concept is related to the treemode of
          // the graph:
          // If treemode is ENABLED, then the extra edges
          // are NOT added to the graph. This causes the graph to
          // have less edges (only one pass through) and therefore 
          // the graph creation algorithm is one of a tree creation
          // algorithm, which, as expected, creates a tree.
          // 
          // Otherwise, if treemode is DISABLED, then all the
          // possible edges will be added to the vis.Graph object,
          // which means that the graph will not be a tree, 
          // with a much higher number of edges.
          if (!this.treemode)
            this.graph.edgesData.add(extraEdge);
        }
      }
      // if the node is new/unique to the graph
      else {

        childArtist.node = {
          // properties required
          id: childArtist.uri,
          label: childArtist.name,
          // custom properties
          artist: childArtist,
          uri: childArtist.uri,
          level: parentNode.level + 1,
          parentNode: parentNode,
          parentNodeId: parentNode.id
        };


        var jenny = childArtist.node; // I'll name her Jenny 8D
        parentNode.childs.add(jenny); // now go play and be nice with your sisters

        this.graph.nodesData.add(childArtist.node);

        var edgesToRemove = this.graph.edgesData.getIds({
          filter: function(edge) {
            return edge.to == childArtist.node.id || edge.from == childArtist.node.id;
          }
        });

        this.graph.edgesData.remove(edgesToRemove);

        // also create the edge to connect the new node to
        // its parent
        this.graph.edgesData.add({
          from: parentArtist.uri,
          to: childArtist.uri
        });

        artistsAdded++;
      }

      this.graph.nodesData.update(parentNode);
    }
    if (iterationDone)
      iterationDone();

  },
  compressNode: function(parentNode) {
    var childNodesIds = parentNode.childs.getIds();

    this.graph.nodesData.remove(childNodesIds);

    parentNode.childs.remove(childNodesIds);
    parentNode.isLeaf = true;
  },

  // Updates the graph with the given config object
  updateConfig: function(config) {
    if (config && config.branching)
      this.updateBranching(config.branching);

    if (config && config.depth)
      this.updateDepth(config.depth);

    if (config && config.treemode !== undefined)
      this.updateTreemode(config.treemode);
  },
  updateBranching: function(branching) {
    this.branching = branching || this.branching;

    console.log('updating braching...', this.branching);

    // TODO
  },
  updateDepth: function(newDepth, update) {
    var oldDepth = this.depth;
    this.depth = newDepth;

    function filterNodes(oldDepth, node) {
      return node.level == (oldDepth - 1);
    }

    if (newDepth > oldDepth) {
      var leafs = this.graph.nodesData.get({
        filter: function(node) {
          return node.level == oldDepth;
        }
      });
      _.each(leafs, function(node) {
        this.expandNode(Math.abs(newDepth - oldDepth - 1), node.artist, update);
      }, this);
    } else if (newDepth < oldDepth) {
      var toRemove = this.graph.nodesData.get({
        filter: function(node) {
          return node.level > newDepth;
        }
      });

      _.each(toRemove, function(node) {
        var edgesToRemove = this.graph.edgesData.getIds({
          filter: function(edge) {
            return (edge.to == node.id || edge.from == node.id);
          }
        });

        this.graph.edgesData.remove(edgesToRemove);
      }, this);

      this.graph.nodesData.remove(toRemove);
      if (update)
        update();
    }
  },
  updateTreemode: function(treemode) {
    this.treemode = treemode;

    console.log('updating treemode...', this.treemode);

    // WIP
    if (this.treemode) {
      this.data.edges =
        _.without(this.data.edges, this.extraEdges);
      this.graph.edgesData.remove(this.extraEdges);
    } else {
      this.graph.edgesData.add(this.extraEdges);
      for (var edge in this.extraEdges) {
        this.data.edges.push(this.extraEdges[edge]);
      }
    }
  },

  getNode: function(artist) {
    return this.graph.nodesData.get({
      filter: function(node) {
        return node.id == artist.uri;
      }
    })[0];
  },
  getEdges: function(to, from) {
    return this.graph.edgesData.get({
      filter: function(edge) {
        return edge.to == to && edge.from == from;
      }
    });
  },
  // number of nodes in the graph
  getNumNodes: function() {
    return this.graph.nodesData.get().length;
  },
  // number of edges in the graph
  getNumEdges: function() {
    return this.graph.edgesData.get().length;
  },

  redrawGraph: function() {
    this.graph.redraw();
  },

  // Events

  // binds the previously saved vis.Graph's events to the
  // graph object
  bindAllGraphEvents: function() {
    for (var event in this.graphevents) {
      this.graph.on(event, this.graphevents[event]);
    }

    this.graph.nodesData.on('*', function() {
      // console.log(arguments);
    });

    this.graph.on('click', function(data) {
      console.log(this.nodesData.get(data.nodes[0]).level);
    });

    this.graph.on('stabilize', function(eventData) {
      this.storePosition();
    });
  },

  // saves the given event, given the proper eventHandler.
  on: function(event, eventHandler) {
    this.events[event] = eventHandler;
  },

  // saves a vis.Graph event, given the proper eventHandler.
  onGraph: function(event, eventHandler) {
    this.graphevents[event] = eventHandler;

    this.graph.on(event, this.graphevents[event]);
  }
};

ArtistGraph.prototype.constructor = ArtistGraph;

// Exports for the spotify's require system
require(['js/utils/spotify'], function(_sputils) {
  sputils = _sputils.utils;
  exports.ArtistGraph = ArtistGraph;
});