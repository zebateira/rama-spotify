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
        hasDependencies: true,
        supports: 'artistmenu',
        events: ['onPlayerChange'],
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
      },
      // eqbar: {
      //   loadtemplate: false,
      //   controller: controllers.EQBar,
      //   numRows: 128
      // },
      tracklist: {
        loadtemplate: true,
        controller: controllers.TrackList,
        events: ['onPlayerChange'],
        selectors: {
          cover: '#tracklist_cover',
          title: '#list_title',
          list: '#list_items'
        }
      },
      artistmenu: {
        loadtemplate: true,
        controller: controllers.ArtistMenu,
        selectors: {
          cover: '#artist_cover',
          popularity: '#artist_pop',
          years: '#artist_years',
          albums: '#artist_albums',
          controls: '#artist_controls',
        },
        hasDependencies: true
      }
    }
  });

  Components.loadViews();

  window.onresize = Components.updateViews;
});