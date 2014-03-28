require([
  'js/nowplaying#nowplaying',
  'js/toplist#toplist',
  'js/search#search'
], function(nowplaying, toplist, search) {

  exports.nowplaying = nowplaying;
  exports.toplist = toplist;
  exports.search = search;
});