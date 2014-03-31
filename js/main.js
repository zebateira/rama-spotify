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
      controller: controllers.nowplaying
    }, {
      viewId: 'toplist',
      name: 'Top List',
      controller: controllers.toplist
    }, {
      viewId: 'search',
      name: 'Search',
      controller: controllers.search
    }]
  });

  Views.loadViews();

  window.onresize = function() {
    Views.updateView();
  };
});