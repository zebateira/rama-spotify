var NowPlaying = {
  init: function(config) {
    this.element = config.element;

    this.artist = {};

    this.options = {
      nodes: {
        color: {
          background: '#333',
          border: '#333'
        },
        fontColor: '#eef',
        shape: 'box',
        radius: 24
      }
    };

    this.artistGraph = {};

    return this;
  }
};

require(['$api/models'], function(models) {
  exports.NowPlaying = NowPlaying;
});