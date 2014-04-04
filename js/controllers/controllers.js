require([
  'js/controllers/nowplaying#nowplaying',
  'js/controllers/toplist#toplist',
  'js/controllers/search#search'
], function(nowplaying, toplist, search) {

  exports.nowplaying = nowplaying;
  exports.toplist = toplist;
  exports.search = search;
});