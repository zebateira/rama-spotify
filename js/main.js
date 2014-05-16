spotify.require([
  'js/components#Components',
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
        supports: ['graph']
      },
      graph: {
        loadtemplate: false,
        controller: controllers.GraphController,
        hasDependencies: true,
        supports: ['artistmenu', 'tagsmenu'],
        events: ['onPlayerChange'],
        options: {
          keyboard: true,
          nodes: {
            color: {
              background: '#2e2f33',
              border: '#3e3e40',
              highlight: {
                border: '#7fb701',
                background: '#313336'
              }
            },
            fontColor: '#dfe0e6',
            fontFace: '',
            shape: 'box',
            radius: 1
          },
          edges: {
            color: {
              color: '#3e3e40',
              highlight: '#dfe0e6'
            }
          }
        },
      },
      eqbar: {
        loadtemplate: false,
        controller: controllers.EQBar,
        numRows: 128
      },
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
          albumsTitle: '#artist_albums_title',
          albums: '#artist_albums',
          controls: '#artist_controls',
          control_expand: '#control_expand',
          control_new: '#control_new',
          tagsTitle: '#artist_tags_title',
          tags: '#artist_tags'
        },
        hasDependencies: true
      },
      tagsmenu: {
        loadtemplate: false,
        controller: controllers.TagsMenu,
        hasDependencies: true
      }
    }
  });

  Components.loadViews();

  window.onresize = Components.updateViews;
});