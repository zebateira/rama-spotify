require = function() {};

sputils = {
  loadRelatedArtists: function(spArtist, n, foreach, done) {
    var name = "name";
    var uri = "uri";

    for (var i = 0; i < n; ++i) {
      foreach({
        name: name + Math.random(),
        uri: uri + Math.random(),
        node: {
          uri: uri
        }
      });
    }
    done();
  }
};