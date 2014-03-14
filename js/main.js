spotify.require([
  'js/views',
], function(views) {

  views.initConfig({
    header: {
      path: '../views/header.html',
      link: 'http://rama.inescporto.pt/app'
    },
    tabs: [{
      id: 'now',
      name: 'Now Playing',
      path: '../views/now.html'
    }, {
      id: 'top',
      name: 'Top List',
      path: '../views/top.html'
    }, {
      id: 'search',
      name: 'Search',
      path: '../views/search.html'
    }],
  });

  views.loadViews();

  // initializes NowPlaying controller and draws the graph
  // now.NowPlaying
  //   .init({
  //     element: $('#index .graph')[0]
  //   })
  //   .loadView();

  // new top.TopList().load();
  // new search.Search().load();

  // todo manager for updating the views
  // note: dont update the graphs when a commercial is playing
  // window.onresize = function() {
  //   now.NowPlaying.updateView();
  // };
});