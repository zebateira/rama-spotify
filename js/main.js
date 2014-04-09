spotify.require([
  'js/components/components#Components',
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
      controller: controllers.NowPlaying
    }, {
      viewId: 'toplist',
      name: 'Top List',
      controller: controllers.TopList
    }]
  });

  Components.loadViews({
    events: {
      'viewchange': Components.updateViews,
      'windowresize': Components.updateViews
    }
  });
});