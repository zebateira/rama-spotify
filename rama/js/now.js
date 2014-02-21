require(['$api/models'], function(models) {

  exports.NowPlaying = function() {

    this.load = function() {
      // console.log(models.player.load);
      models.player.load(['playing']).done(function(property) {
        // this.uri = property.track;
        console.log(property);
      });
    };
  };
});