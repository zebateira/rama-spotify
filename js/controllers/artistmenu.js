require([
  '$api/models',
  'js/controllers/controller#controller',
  '$views/image#Image'
], function(models, Controller, Image) {

  var ArtistMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      var onPlayerChange = this.onPlayerChange.bind(this);
      models.player.addEventListener('change', function() {
        models.player.load('track').done(onPlayerChange);
      });
    }
  });

  ArtistMenu.implement({
    afterLoad: function(graphcontroller) {
      this.artistGraph = graphcontroller.artistGraph;

      models.player.load('track').done(this, function() {
        this.artist = models.Artist.fromURI(models.player.track.artists[0].uri);
        this.loadImage(this.artist);
        this.artistGraph.on('click', this.onClickNode.bind(this));
      });

    },
    updateView: function() {

    },
    loadImage: function(artist) {
      this.image = Image.forArtist(artist, {
        width: 150,
        height: 150,
        style: 'plain',
        overlay: [artist.name]
      });

      this.jelement.html('');
      this.jelement.append(this.image.node);
    },
    onClickNode: function(data) {
      var node = _.findWhere(this.artistGraph.data.nodes, {
        id: parseInt(data.nodes[0])
      });

      if (!node)
        return;

      this.loadImage(node.artist);
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
        this.loadImage(this.artist);
      });
    }
  });

  exports.artistmenu = ArtistMenu;
});