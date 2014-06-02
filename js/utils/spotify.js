require(['$api/models'], function(models) {
  exports.utils = {

    loadRelatedArtists: function(spArtist, done) {
      // load the related artists property
      spArtist.load('related').done(function(spArtist) {
        // when done loading, load the current snapshot of the array
        // of artists, with this.branching length
        spArtist.related
          .snapshot().done(function(snapshot) {
            // when done loading, load name and uri properties
            // of each artist in the snapshot
            snapshot.loadAll(['name', 'uri'])
            // call forEachRelated on each artist
            // .each(foreach)
            // when done on each artist, run callback
            // this callback will get all of the artists in an array
            // as parameters
            .done(done);
          });
      });
    }
  };
});