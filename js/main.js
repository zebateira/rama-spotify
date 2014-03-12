spotify.require([
  'js/views',
], function(views) {

  views.initConfig({
    header: {
      path: '../views/header.html'
    },
    tabs: [{
      id: 'now',
      name: 'Now Playing',
      element: $('#now .graph')
    }, {
      id: 'top',
      name: 'Top List',
      element: $('#top .graph')
    }, {
      id: 'search',
      name: 'Search',
      element: $('#search .graph')
    }],
  });

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