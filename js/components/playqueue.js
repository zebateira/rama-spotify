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
    $(PlayQueue.selector).load(PlayQueue.path, afterLoad);

    function afterLoad(data) {
      var artist = models.Artist.fromURI('spotify:artist:2UwJRAgSOi1zcLkvUNc8XL');
      var image = Image.forArtist(artist, {
        width: 100,
        height: 100
      });
      $(this).find('#playqueue_cover').append(image.node);
    }
  },
  updateView: function() {

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