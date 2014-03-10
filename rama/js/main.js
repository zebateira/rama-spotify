spotify.require([
  '$api/models',
  '$views/ui#UI',
  'js/now',
  'js/top',
  'js/search'
], function(models, UI, now, top, search) {

  var ui = UI.init({
    header: true,
    views: [{
      id: 'now',
      element: document.getElementById('index')
    }, {
      id: 'top',
      element: document.getElementById('top')
    }, {
      id: 'search',
      element: document.getElementById('search')
    }],
    tabs: [{
      viewId: 'now',
      name: 'Now Playing'
    }, {
      viewId: 'top',
      name: 'Top Artists'
    }, {
      viewId: 'search',
      name: 'Search'
    }]
  });

  $(ui.header).load('views/header.html');

  new now.NowPlaying().load();
  new top.TopList().load();
  new search.Search().load();
});