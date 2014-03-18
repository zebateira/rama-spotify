spotify.require([
  'js/views',
  'js/controllers'
], function(views, controllers) {

  views.initConfig({
    header: {
      path: '../views/header.html',
      link: 'http://rama.inescporto.pt/app'
    },
    tabs: [{
      viewId: 'now',
      name: 'Now Playing',
      path: '../views/now.html',
      controller: controllers.nowplaying
    }, {
      viewId: 'top',
      name: 'Top List',
      path: '../views/top.html',
      controller: controllers.toplist
    }, {
      viewId: 'search',
      name: 'Search',
      path: '../views/search.html',
      controller: controllers.search
    }],
  });

  views.loadViews();

  // todo manager
  // for updating the views
  // note: dont update the graphs when a commercial is playing
  window.onresize = function() {
    now.NowPlaying.updateView();
  };
});