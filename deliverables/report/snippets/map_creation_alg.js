// starting point for building the graph
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
function expandNode(depth, parentArtist) {
  var node = this.getNode(parentArtist);

  // after expanding, the node will stop being a leaf
  node.isLeaf = false;

  // retrieve this.branching number of childs of the parent artist
  var relatedArtists = parentArtist.getRelatedArtists(this.branching);

  // and do the recursive call for the child, but with decreased depth.
  for (var childArtist in relatedArtists) {
    // create the child node and insert it into the graph
    this.insertNode(childArtist);

    // recursive call for the child with decreased depth
    if (depth > 0)
      expandNode(depth - 1, childArtist);
    // note that the stop condition of the recursion is depth <= 0
  }
}