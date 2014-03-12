spotify.require([
  'js/views',
], function(views) {

  views.initConfig({
    header: {
      path: '../views/header.html'
    },
    tabs: [{
      id: 'now',
      name: 'Now Playing'
    }, {
      id: 'top',
      name: 'Top List'
    }, {
      id: 'search',
      name: 'Search'
    }],
  });

  views.start();

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