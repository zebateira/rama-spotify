/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var spUI;

// execptions
var HeaderMissingException;
var TabsMissingException;
var TabInfoMissingException;

// spotify exports
require(['$views/ui#UI', 'js/exceptions'], function(ui, _exceptions) {
  spUI = ui;

  HeaderMissingException = _exceptions.HeaderMissingException;
  TabsMissingException = _exceptions.TabsMissingException;
  TabInfoMissingException = _exceptions.TabInfoMissingException;

  exports.initConfig = views.initConfig;
  exports.loadViews = views.loadViews;
});

var views = {
  DEFAULT_PATH: '../views/',

  initConfig: function(config) {
    views.header.init(config.header);
    views.tabBar.init(config.tabs);
  },
  header: {
    selector: '.sp-header',
    init: function(config) {
      if (!config)
        throw new HeaderMissingException();

      views.header.DEFAULT_PATH =
        views.DEFAULT_PATH + 'header.html';
      views.header.link = config.link || false;
      views.header.path = config.path || views.header.DEFAULT_PATH;
    },
    load: function() {
      $(views.header.selector)
        .load(views.header.path, views.header.afterLoad);
    },
    afterLoad: function() {
      if (!views.header.link)
        $('.header-link', views.header.selector).hide();
      else
        $('.header-link > a', views.header.selector)
          .attr('href', views.header.link);
    },
    reset: function() {
      views.header.path = '';
      views.header.link = '';
    }
  },
  tabBar: {
    init: function(tabs) {
      if (!(tabs instanceof Array))
        throw new TabsMissingException();

      views.tabs = tabs;

      _.each(views.tabs, function(tab) {
        if (!tab.id || !tab.name)
          throw new TabInfoMissingException();

        tab.path = tab.path || views.tabBar.getDefaultPath(tab.id);
      });
    },
    reset: function() {
      views.tabs = {};
    },
    getDefaultPath: function(tabID) {
      return views.DEFAULT_PATH + tabID + '.html';
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

    views.header.load();
  },
  reset: function() {
    views.header.reset();
    views.tabBar.reset();
  }
};