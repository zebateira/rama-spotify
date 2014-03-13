/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// spotify modules
var spUI = {};

// spotify exports
require(['$views/ui#UI'], function(ui) {
  spUI = ui;
  exports.initConfig = views.initConfig;
  exports.loadViews = views.loadViews;
});

var views = {
  initConfig: function(config) {
    views.header.init(config.header);
    views.tabBar.init(config.tabs);
  },
  header: {
    init: function(config) {
      if (!config || !config.path)
        throw "Views: No path for header.html specified!";

      views.header.path = config.path;
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