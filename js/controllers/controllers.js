require([
  'js/controllers/nowplaying#NowPlaying',
  'js/controllers/toplist#TopList',
  'js/controllers/search#Search'
], function(NowPlaying, TopList, search) {

  exports.NowPlaying = NowPlaying;
  exports.TopList = TopList;
  exports.search = search;
});