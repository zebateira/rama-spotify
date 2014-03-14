/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var spUI;
var HeaderMissingException;

// spotify exports
require(['$views/ui#UI', 'js/exceptions'], function(ui, _exceptions) {
  spUI = ui;

  HeaderMissingException = _exceptions.HeaderMissingException;


  exports.initConfig = views.initConfig;
  exports.loadViews = views.loadViews;
});

var views = {
  DEFAULT_HEADER_PATH: "../views/header.html",

  initConfig: function(config) {
    views.header.init(config.header);
    views.tabBar.init(config.tabs);
  },
  header: {
    init: function(config) {
      if (!config)
        throw new HeaderMissingException().toString();

      views.header.path = config.path || views.DEFAULT_HEADER_PATH;
    },
  },
  tabBar: {
    init: function(config) {
      views.tabs = config;
    }
  },
  loadViews: function() {
    spUI = spUI.init({
      header: true,
      views: [{
        id: 'now',
        element: document.getElementById('now')
      }, {
        id: 'top',
        element: document.getElementById('top')
      }, {
        id: 'search',
        element: document.getElementById('search')
      }],
      tabs: [{
        viewId: 'now',
        name: 'Now Playing',
      }, {
        viewId: 'top',
        name: 'Top Artists'
      }, {
        viewId: 'search',
        name: 'Search'
      }]
    });

    $(spUI.header).load(views.header.path);
  }
};