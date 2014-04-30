require([
  '$api/models',
  'js/controllers/controller#controller',
  '$views/image#Image'
], function(models, Controller, Image) {

  var ArtistMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      _.bindAll(this, 'onPlayerChange');
      var onPlayerChange = this.onPlayerChange;
      models.player.addEventListener('change', function() {
        models.player.load('track').done(onPlayerChange);
      });
    }
  });

  ArtistMenu.implement({
    afterLoad: function(graphcontroller) {
      this.artistGraph = graphcontroller.artistGraph;

      var artistmenu = this;

      this.artistGraph.on('click', function(data) {
        models.player.load('track').done(this, function(player) {
          var artist = models.Artist.fromURI(player.track.artists[0].uri);

          this.image = Image.forArtist(artist, {
            width: 200,
            height: 200,
            style: 'plain',
            overlay: [artist.name]
          });

          this.jelement.html('');
          artistmenu.jelement.append(this.image.node);

        });
      });
    },
    updateView: function() {

    },
    onPlayerChange: function() {
      models.player.load('track').done(this, function(player) {
        var artist = models.Artist.fromURI(
          models.Artist.fromURI(player.track.artists[0].uri)
        );

        if ((this.artist && this.artist.uri === artist.uri) ||
          player.track.advertisement) {
          return;
        }

        this.artist = artist;

        this.image = Image.forArtist(artist, {
          width: 200,
          height: 200,
          style: 'plain',
          overlay: [artist.name]
        });

        this.jelement.html('');

        this.jelement.append(this.image.node);
      });
    }
  });

  exports.artistmenu = ArtistMenu;
});