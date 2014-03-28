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
        viewId: 'nowplaying',
        name: 'Now Playing',
        path: '../views/nowplaying.html',
        controller: controllers.nowplaying
      }
      // , {
      //   viewId: 'top',
      //   name: 'Top List',
      //   path: '../views/top.html',
      //   controller: controllers.toplist
      // }, {
      //   viewId: 'search',
      //   name: 'Search',
      //   path: '../views/search.html',
      //   controller: controllers.search
      // }
    ]
  });

  views.loadViews();

  window.onresize = function() {
    views.updateView();
  };
});