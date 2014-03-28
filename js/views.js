/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var spUI;

// execptions
var HeaderMissingException,
  TabsMissingException,
  TabInfoMissingException,
  TabMissingControllerException;

// spotify exports
require([
  '$views/ui#UI',
  'js/exceptions'
], function(ui, _exceptions) {
  spUI = ui;

  HeaderMissingException = _exceptions.HeaderMissingException;
  TabsMissingException = _exceptions.TabsMissingException;
  TabInfoMissingException = _exceptions.TabInfoMissingException;
  TabMissingControllerException = _exceptions.TabMissingControllerException;

  exports.initConfig = views.initConfig;
  exports.loadViews = views.loadViews;
  exports.updateView = views.updateView;
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
        if (!tab.viewId || !tab.name)
          throw new TabInfoMissingException(tab);

        tab.id = tab.viewId;
        tab.element = document.getElementById(tab.id);
        tab.path = tab.path || views.tabBar.getDefaultPath(tab.viewId);

        if (!tab.controller || tab.controller === undefined || (typeof tab.controller.init) !== 'function')
          throw new TabMissingControllerException();

        tab.controller.init(tab.id, views.DEFAULT_PATH + tab.path);
      });
    },
    load: function() {
      _.each(views.tabs, function(tab) {
        tab.controller.loadView();
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
      views: views.tabs,
      tabs: views.tabs
    });

    views.header.load();
    views.tabBar.load();

    spUI.addEventListener('viewchange', views.updateView);

  },
  updateView: function(tab) {
    var tabID = (tab ? tab.id : spUI.activeView);

    _.where(views.tabs, {
      id: tabID
    })[0].controller.updateView();
  },
  reset: function() {
    views.header.reset();
    views.tabBar.reset();
  }
};