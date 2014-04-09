require([
  'js/controllers/nowplaying#NowPlaying',
  'js/controllers/toplist#TopList'
], function(NowPlaying, TopList) {

  exports.NowPlaying = NowPlaying;
  exports.TopList = TopList;
});