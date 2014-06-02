require = function() {};

sputils = {
  loadRelatedArtists: function(spArtist, done) {
    var name = "name";
    var uri = "uri";
    var artists = [];

    for (var i = 0; i < 20; ++i) {
      artists.push({
        name: name + Math.random(),
        uri: uri + Math.random(),
        node: {
          uri: uri
        }
      });
    }
    done(artists);
  }
};