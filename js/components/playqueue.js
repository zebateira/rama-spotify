/** 
  Artist Menu
*/
var ConfigObjectMissing;
var models;
var Image;

var PlayQueue = {
  init: function(config) {
    if (!config)
      throw new ConfigObjectMissing();

    PlayQueue.path = config.path || '../views/playqueue.html';
    PlayQueue.selector = config.selector || '#playqueue';
  },
  loadView: function() {
    var playqueue = this;
    $(PlayQueue.selector).load(PlayQueue.path, function() {
      playqueue.loadImage();
    });
  },
  updateView: function() {
    this.loadImage();
  },
  loadImage: function() {
    models.player.load('track').done(this, function(player) {
      var artist = models.Artist.fromURI(
        models.Artist.fromURI(player.track.artists[0].uri)
      );
      console.log(player.track.album.uri);

      this.image = Image.forArtist(artist, {
        width: 50,
        height: 50,
        style: 'plain',
      });
      var wrapper = $(this.selector).find('#playqueue_cover').html('');
      $(wrapper).append(this.image.node);
    });
  },
  reset: function() {
    PlayQueue.path = '';
    PlayQueue.selector = '';
  }
};

require(['js/exceptions',
    '$api/models',
    '$views/image#Image'
  ],
  function(_exceptions, _models, _image) {
    exports.playqueue = PlayQueue;

    models = _models;
    Image = _image;
    ConfigObjectMissing = _exceptions.ConfigObjectMissing;
  });