/** 
  Artist Menu
*/
var ConfigObjectMissing;
var models;
var Image;

var PlayQueue = {
  selectors: {
    cover: '#playqueue_cover',
    list: '#list_title'
  },
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
    PlayQueue.loadImage();
  },
  loadImage: function() {
    models.player.load('track').done(function(player) {
      var artist = models.Artist.fromURI(
        models.Artist.fromURI(player.track.artists[0].uri)
      );

      PlayQueue.image = Image.forArtist(artist, {
        width: 50,
        height: 50,
        style: 'plain',
      });
      var wrapper =
        $(PlayQueue.selector).find('#playqueue_cover').html('');

      $(wrapper).append(PlayQueue.image.node);

      $(PlayQueue.selectors.list).html('More from ' + artist.name);

      // artist.load('compilations').done(function(artist) {
      //   artist.compilations.loadAll('type').each(function(track) {
      //     console.log(track);
      //   });
      //   artist.compilations.snapshot(0, 10).done(function(snapshot) {
      //     snapshot.loadAll('name').each(function(track) {
      //       console.log(track);
      //     });
      //   });
      // });
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
    exports.tracklist = PlayQueue;

    models = _models;
    Image = _image;
    ConfigObjectMissing = _exceptions.ConfigObjectMissing;
  });