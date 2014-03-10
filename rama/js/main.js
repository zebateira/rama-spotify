spotify.require([
  '$api/models',
  '$views/ui#UI',
  'js/now#NowPlaying',
  'js/top',
  'js/search',
], function(models, UI, NowPlaying, top, search) {

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

  // loading header view
  $(ui.header).load('views/header.html');

  // initializes NowPlaying controller and draws the graph
  NowPlaying
    .init({
      element: $('#index .graph')[0]
    })
    .loadView();

  new top.TopList().load();
  new search.Search().load();
});