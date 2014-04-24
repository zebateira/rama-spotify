spotify.require([
  'js/components/components#Components',
  'js/controllers/controllers'
], function(Components, controllers) {

  Components.initConfig({
    config: {
      viewspath: '../views/',
      template: '.html',
      selectorPrefix: '#'
    },
    components: {
      header: {
        loadtemplate: true,
        applink: 'http://rama.inescporto.pt/app',
        controller: controllers.Header
      },
      graph: {
        loadtemplate: false,
        controller: controllers.GraphController,
        options: {
          nodes: {
            color: {
              background: '#474747',
              border: '#555'
            },
            fontColor: '#ddd',
            fontFace: '',
            shape: 'box',
            radius: 1
          },
          edges: {
            color: {
              color: '#8f9096',
              highlight: '#8f9096'
            }
          },
          stabilize: true
          // clustering: true
        }
      },
      settingsmenu: {
        loadtemplate: true,
        // controller: controllers.Settings
      },
      eqbar: {
        loadtemplate: false,
        numRows: 128,
        // controller: controllers.EQBar
      },
      tracklist: {
        loadtemplate: true,
        // controller: controllers.TrackList
      },
      artistmenu: {
        loadtemplate: false,
        // controller: controllers.ArtistMenu
      }
    }
  });

  Components.loadViews({
    events: {
      'viewchange': Components.updateViews,
      'windowresize': Components.updateViews
    }
  });
});