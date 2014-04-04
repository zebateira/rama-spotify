require([
  'js/controllers/nowplaying#NowPlaying',
  'js/controllers/toplist#toplist',
  'js/controllers/search#search'
], function(NowPlaying, toplist, search) {

  exports.NowPlaying = NowPlaying;
  exports.toplist = toplist;
  exports.search = search;
});