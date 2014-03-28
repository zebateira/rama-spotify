spotify.require([
  'js/views',
  'js/controllers'
], function(Views, controllers) {

  Views.initConfig({
    header: {
      path: '../views/header.html',
      link: 'http://rama.inescporto.pt/app'
    },
    tabs: [{
      viewId: 'nowplaying',
      name: 'Now Playing',
      path: '../views/nowplaying.html',
      controller: controllers.nowplaying
    }, {
      viewId: 'toplist',
      name: 'Top List',
      path: '../views/toplist.html',
      controller: controllers.toplist
    }, {
      viewId: 'search',
      name: 'Search',
      path: '../views/search.html',
      controller: controllers.search
    }]
  });

  Views.loadViews();

  window.onresize = function() {
    Views.updateView();
  };
});