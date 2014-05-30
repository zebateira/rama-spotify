require(['$api/models'], function(models) {
  exports.utils = {

    loadRelatedArtists: function(spArtist, n, foreach, done) {
      // load the related artists property
      spArtist.load('related').done(function(spArtist) {
        // when done loading, load the current snapshot of the array
        // of artists, with this.branching length
        spArtist.related
          .snapshot(0, n).done(function(snapshot) {
            // when done loading, load name and uri properties
            // of each artist in the snapshot
            snapshot.loadAll(['name', 'uri'])
            // call forEachRelated on each artist
            .each(foreach)
            // when done on each artist update the number of iterations
            .done(done);
          });
      });
    }
  };
});