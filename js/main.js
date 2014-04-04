spotify.require([
  'js/controllers/components#Components',
  'js/controllers/controllers'
], function(Components, controllers) {

  Components.initConfig({
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

  Components.loadViews();

  window.onresize = function() {
    Components.updateViews();
  };
});