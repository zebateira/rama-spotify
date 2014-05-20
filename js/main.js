spotify.require([
  'js/components#Components',
  'js/controllers/controllers'
], function(Components, controllers) {

  // Components object initial configuration  for the UI components
  //
  // A configuration object is passed on to the initConfig function
  // which then takes care of initializing all of the options
  // and ui components

  Components.initConfig({

    // Global configuration options
    config: {
      // path of the view files templates
      viewspath: '../views/',
      // format of the templates
      template: '.html',
      // prefix for the DOM selectors
      selectorPrefix: '#'
    },

    // List of UI components
    //
    // Note: the components' containers should be in the index.html
    components: {
      // Configuration options for each component
      // 
      //   selector:
      //     DOM selector of the component's container.
      //     default: key value of specified component. example:
      //              header: { ... }
      //              selector = header
      // 
      //   loadtemplate:
      //     Should the template be loaded or not from the template
      //     file.
      //
      //   viewpath:
      //     Template path to load the it from.
      //     Overrides the default path.
      //
      //   controller:
      //     Controller object for the UI component.
      //     The object should be of type
      //     controllers.Controller and implement the
      //     afterLoad function handler.
      //
      //   supports:
      //     Specifies the objects that this component supports.
      //     This means that only after this component's controller 
      //     finishes the afterLoad function, can the supported
      //     controllers be initialized. The supported controllers
      //     will get this controller in the afterLoad parameter.
      //     Related to the hasDependencies property.
      //
      //   hasDependencies:
      //     Whether this component has dependencies or not.
      //     If it does, it will wait until all of its dependencies
      //     have finished the afterLoad function, to initialize.
      //
      //   custom properties:
      //     any other properties passed on to the component will
      //     be saved in the config property inside the controller.
      //     as long they don't conflict with the above ones,
      //     any custom properties can (and should) be defined.
      header: {
        loadtemplate: true,
        controller: controllers.Header,
        // link for the external RAMA app
        applink: 'http://rama.inescporto.pt/app',
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
        // options for the vis.Graph's object
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
        // number of rows for the equalizer
        numRows: 128
      },
      tracklist: {
        loadtemplate: true,
        controller: controllers.TrackList,
        events: ['onPlayerChange'],
        // tracklist's specific DOM selectors
        selectors: {
          cover: '#tracklist_cover',
          title: '#list_title',
          list: '#list_items'
        }
      },
      artistmenu: {
        loadtemplate: true,
        controller: controllers.ArtistMenu,
        // artistmenu's specific DOM selectors
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

  // load all of the previously declared views
  Components.loadViews();

  window.onresize = Components.updateViews;
});