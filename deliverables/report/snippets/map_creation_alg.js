function buildGraph() {
  // create a node with the root artist and insert it into the graph
  this.insertNode(this.rootArtist);

  // start constructing the graph recursively
  this.expandNode(
    this.depth - 1,
    this.rootArtist
  );
}

// Expands the node of the parent artist by this.branching.
// It recursively decreases the depth parameter.
function expandNode(depth, parentArtist) {
  var node = this.getNode(parentArtist);

  // after expanding, the node will stop being a leaf
  node.isLeaf = false;

  // retrieve this.branching number of childs
  var relatedArtists = parentArtist.getRelatedArtists(this.branching);

  for (var childArtist in relatedArtists) {
    this.insertNode(childArtist);
    this.insertEdge({
      from: parentArtist,
      to: childArtist
    });

    if (depth > 0)
      expandNode(depth - 1, childArtist);
  }
}