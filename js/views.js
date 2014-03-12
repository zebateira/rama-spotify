/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// views module "exports"

// spotify modules
var spUI;

// spotify exports
require(['$views/ui#UI'], function(ui) {
  spUI = ui;
  exports.initConfig = views.initConfig;
  exports.start = views.start;
});

var views = {
  initConfig: function(config) {
    views.header.path = config.header.path;
  },
  start: function() {
    views.header.init();
  },
  header: {
    init: function() {
      var ui = spUI.init({
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
          name: 'Now Playing'
        }, {
          viewId: 'top',
          name: 'Top Artists'
        }, {
          viewId: 'search',
          name: 'Search'
        }]
      });

      // loading header view
      $(ui.header).load('../views/header.html');
    }
  },
  tabs: {

  }
};