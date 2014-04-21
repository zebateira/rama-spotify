/** 
  Artist Menu
*/
var ConfigObjectMissing;

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
      var album = models.Album.fromURI('spotify:album:2mCuMNdJkoyiXFhsQCLLqw');
      var image = Image.forAlbum(album, {
        width: 100,
        height: 100
      });
      document.body.appendChild(image.node);
    }
  },
  updateView: function() {

  },
  reset: function() {
    PlayQueue.path = '';
    PlayQueue.selector = '';
  }
};

require(['js/exceptions'], function(_exceptions) {
  exports.playqueue = PlayQueue;

  ConfigObjectMissing = _exceptions.ConfigObjectMissing;
});