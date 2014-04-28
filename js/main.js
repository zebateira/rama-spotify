spotify.require([
  'js/components/components#Components',
  'js/controllers/controllers',
  '$api/models'
], function(Components, controllers, models) {

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
      settings: {
        loadtemplate: true,
        controller: controllers.Settings,
        supports: 'graph'
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
          //, clustering: true
        },
        hasDependencies: true
      },
      eqbar: {
        loadtemplate: false,
        numRows: 128,
        controller: controllers.EQBar
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