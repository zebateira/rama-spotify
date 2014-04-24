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
        controller: controllers.Header,
        events: {
          afterLoad: function(_this) {
            if (!_this.link)
              $('.header-link', _this.selector).hide();
            else
              $('.header-link > a', _this.selector)
                .attr('href', _this.applink);
          }
        }
      },
      graph: {
        loadtemplate: false,
        controller: controllers.GraphController
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