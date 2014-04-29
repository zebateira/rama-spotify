require([
  '$api/models',
  'js/controllers/controller#controller'
], function(models, Controller) {
  var ArtistMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      _.bindAll(this, 'onPlayerChange');
      var onPlayerChange = this.onPlayerChange;
      models.player.addEventListener('change', function(player) {
        models.player.load('track').done(onPlayerChange);
      });
    }
  });

  ArtistMenu.implement({
    afterLoad: function(graphcontroller) {
      this.artistGraph = graphcontroller.artistGraph;

      var jelement = this.jelement;
      this.artistGraph.on('click', function(data) {
        console.log(data);
        jelement.toggle();
      });
    },
    updateView: function() {

    },
    onPlayerChange: function(player) {
      models.player.load('track').done(this, function(player) {
        var artist = models.Artist.fromURI(
          models.Artist.fromURI(player.track.artists[0].uri)
        );

        if ((this.artist && this.artist.uri === artist.uri) ||
          player.track.advertisement) {
          return;
        }

        this.artist = artist;

        this.jelement.find(this.config.selectors.cover).html('');
        this.jelement.find(this.config.selectors.list).html('');

        this.artistGraph.on('click', function(data) {
          console.log(data);
        });

      });
    }
  });

  exports.artistmenu = ArtistMenu;
});