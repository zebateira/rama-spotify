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

  // load branching value from config if present
  // otherwise, load ArtistGraph.DEFAULT_BRANCHING
  this.branching = (config && config.branching) ||
    ArtistGraph.DEFAULT_BRANCHING;
  // load depth value from config if present
  // otherwise, load ArtistGraph.DEFAULT_DEPTH
  this.depth = (config && config.depth) ||
    ArtistGraph.DEFAULT_DEPTH;

  // load treemode value from config if present
  // otherwise, load ArtistGraph.DEFAULT_TREEMODE
  if (config && typeof config.treemode !== 'undefined')
    this.treemode = config.treemode;
  else this.treemode = ArtistGraph.DEFAULT_TREEMODE;

  // options to be passed on to vis.Graph object
  this.options = (config && config.options) ||
    ArtistGraph.DEFAULT_OPTIONS;

  this.initGraph();

  // create the vis.Graph Object
  this.graph =
    new vis.Graph(this.element, this.data, this.options);

  this.graph.on('stabilize', function(eventData) {
    this.storePosition();
    console.log(eventData);
  });

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
    this.extraEdges = [];

    // current id value for the vis.Graph's nodes
    this.currentNodeId = 1;

    // data object to be passed on to the vis.Graph object
    this.data = {
      nodes: [{
        id: this.currentNodeId,
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
        // isLeaf simply indicates if the node is a leaf
        // in the graph or not
        isLeaf: false,
        level: 0,
        // is this the root node?
        isRoot: true
      }],
      edges: []
    };
  },

  // alias to initGraph
  reset: function() {
    this.initGraph();
  },

  // Resets state variables and starts constructing the graph
  buildGraph: function(done) {
    // Current number of iterations (recursive calls)
    // done to construct the graph
    var currentIteration = 1;

    // Maximum number of iterations that will be performed
    // to construct the graph.
    this.maxIterations =
      (function lambda(i) {
      return Math.pow(this.branching, i) +
        (i < this.depth ? lambda.bind(this)(i + 1) : 0);
    }).bind(this)(0);

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
        this.graph.storePosition();

        this.updateData();
        if (done)
          done();
      }
    }
  },

  // Expands the node of the parent artist by this.branching.
  // It recursively decreases the depth parameter.
  // The done parameter is the callback to be called
  // after all the callbacks of the child nodes of the root node
  // have finished.
  expandNode: function(depth, parentArtist, done) {

    // after expanding, the node will stop being a leaf
    var parentNode = this.getNode(parentArtist);

    parentNode.childs = [];
    parentNode.isLeaf = false;

    // load the related artists property
    parentArtist.load('related').done(this, function(parentArtist) {
      // when done loading, load the current snapshot of the array
      // of artists, with this.branching length
      parentArtist.related
        .snapshot(0, this.branching).done(this, function(snapshot) {
          // when done loading, load name and uri properties
          // of each artist in the snapshot
          snapshot.loadAll(['name', 'uri'])
          // call forEachRelated on each artist
          .each(this, forEachRelated)
          // when done on each artist update the number of iterations
          .done(this, function() {
            this.updateData();

            if (done)
              done();
          });
        });
    });

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
        var edgeExists = _.findWhere(this.data.edges, {
          to: duplicated.id,
          from: parentArtist.nodeid
        });
        // try to find repeated edges (even if inverse)
        var inverseEdgeExists = _.findWhere(this.data.edges, {
          from: duplicated.id,
          to: parentArtist.nodeid
        });

        // if the edge we are trying to insert 
        // does not exist in the graph yet AND
        // the two nodes connecting the edge are not the same one
        // then insert edge.
        // 
        // The latter test was added after metadata errors were found:
        // sometimes, an artist would exist itself in its related
        // artists list, which created a edge that went from it to 
        // itself.
        if (!edgeExists && !inverseEdgeExists &&
          childArtist.uri !== parentArtist.uri) {

          // Create the extra edge.
          var extraEdge = {
            from: parentArtist.nodeid,
            to: duplicated.id,
          };
          this.extraEdges.push(extraEdge);

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
            this.data.edges.push(extraEdge);
        }
      }
      // if the node is new/unique to the graph
      else {

        var childNode = {
          // properties required
          id: ++this.currentNodeId,
          label: childArtist.name,
          // custom properties
          artist: childArtist,
          uri: childArtist.uri,
          isLeaf: depth <= 0,
          level: parentNode.level + 1,
          parentNode: parentNode,
          parentNodeId: parentNode.id,
          x: this.graph.nodesData.get(parentNode.id).x,
          y: this.graph.nodesData.get(parentNode.id).y
        };

        // also create the edge to connect the new node to
        // its parent
        this.data.edges.push({
          from: parentArtist.nodeid,
          to: this.currentNodeId
        });

        childArtist.nodeid = this.currentNodeId;

        var jenny = childNode; // I'll name her Jenny 8D
        parentNode.childs.push(jenny); // now go play and be nice with your sisters

        this.data.nodes.push(childNode);

      }

      // if a leaf node as not been reached, then continue
      // constructing the graph, now with this child node
      // as the root node
      if (depth > 0)
        this.expandNode(depth - 1, childArtist, done);
      // note: the condition to end the recursion is: if depth <= 0
      this.updateNodes();
      this.updateEdges();
    }

  },
  compressNodes: function(leafNodes) {
    var parentNodes = _.groupBy(leafNodes, 'parentNodeId');

    _.each(parentNodes, function(childnodes, parentNodeId) {

      var parentNode = childnodes[0].parentNode;

      _.each(childnodes, function(childnode, index) {

        this.data.nodes = _.filter(this.data.nodes, function(node) {
          return node.id !== childnode.id;
        }, this);
        this.graph.nodesData.remove(childnode);
      }, this);

      parentNode.isLeaf = true;
      parentNode.childs = []; // my jenneeeeys u_u
    }, this);

    this.updateNodes();
    this.updateEdges();
  },

  redrawGraph: function() {
    this.graph.redraw();
  },

  // Updates the graph with the given config object
  updateConfig: function(config, done) {
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
  updateDepth: function(newDepth) {
    console.log('updating depth...', newDepth);
    var oldDepth = this.depth;

    var leafs = _.where(this.data.nodes, {
      level: oldDepth
    });


    function expandWrapper(node) {
      this.expandNode(Math.abs(newDepth - oldDepth - 1), this.getArtist(node),
        this.updateData.bind(this));
    }

    if (newDepth > oldDepth) {
      this.depth = newDepth;
      _.each(leafs, expandWrapper, this);
    } else if (newDepth < oldDepth) {
      var inc = Math.min(1, Math.max(-1, newDepth - oldDepth));

      while (oldDepth !== newDepth) {
        leafs = _.where(this.data.nodes, {
          level: oldDepth
        });

        this.compressNodes(leafs);

        oldDepth += inc;
        this.depth += inc;
      }
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
    this.updateEdges();
  },

  // Refresh vis.Graph's data objects
  updateData: function() {
    this.updateNodes();
    this.updateEdges();

    this.events.updateTagsMenu();
  },
  updateNodes: function() {
    this.graph.nodesData.update(this.data.nodes);
  },
  updateEdges: function() {
    this.graph.edgesData.update(this.data.edges);
  },

  // Get the node of the given artist.
  // return undefined if not found.
  getNode: function(artist) {
    return _.findWhere(
      this.data.nodes, {
        uri: artist.uri
      }
    );
  },
  getArtist: function(node) {
    return models.Artist.fromURI(node.uri);
  },

  // Events

  // binds the previously saved vis.Graph's events to the
  // graph object
  bindAllGraphEvents: function() {
    for (var event in this.graphevents) {
      this.graph.on(event, this.graphevents[event]);
      console.log(event);
    }
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

var models = {};

// Exports for the spotify's require system
require(['$api/models'], function(_models) {
  models = _models;

  exports.ArtistGraph = ArtistGraph;
});