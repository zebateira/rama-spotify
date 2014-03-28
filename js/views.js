/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var spUI;
var Header;

// imported exceptions
var HeaderMissingException,
  TabsMissingException,
  TabInfoMissingException,
  TabMissingControllerException;

// spotify exports
require([
  '$views/ui#UI',
  'js/views/header',
  'js/exceptions'
], function(ui, _header, _exceptions) {
  spUI = ui;

  Header = _header;

  HeaderMissingException = _exceptions.HeaderMissingException;
  TabsMissingException = _exceptions.TabsMissingException;
  TabInfoMissingException = _exceptions.TabInfoMissingException;
  TabMissingControllerException = _exceptions.TabMissingControllerException;

  exports.initConfig = Views.initConfig;
  exports.loadViews = Views.loadViews;
  exports.updateView = Views.updateView;
});

var Views = {
  DEFAULT_PATH: '../views/',

  initConfig: function(config) {
    Header.init(config.header, Views.DEFAULT_PATH);
    Views.tabBar.init(config.tabs);
  },
  tabBar: {
    init: function(tabs) {
      if (!(tabs instanceof Array))
        throw new TabsMissingException();

      Views.tabs = tabs;

      _.each(Views.tabs, function(tab) {
        if (!tab.viewId || !tab.name)
          throw new TabInfoMissingException(tab);

        tab.id = tab.viewId;
        tab.element = document.getElementById(tab.id);
        tab.path = tab.path || Views.tabBar.getDefaultPath(tab.viewId);

        if (!tab.controller || tab.controller === undefined || (typeof tab.controller.init) !== 'function')
          throw new TabMissingControllerException();

        tab.controller.init(tab.id, tab.path);
      });
    },
    load: function() {
      _.each(Views.tabs, function(tab) {
        tab.controller.loadView();
      });
    },
    reset: function() {
      Views.tabs = {};
    },
    getDefaultPath: function(tabID) {
      return Views.DEFAULT_PATH + tabID + '.html';
    }
  },
  loadViews: function() {
    spUI = spUI.init({
      header: true,
      views: Views.tabs,
      tabs: Views.tabs
    });

    Header.load();
    Views.tabBar.load();

    spUI.addEventListener('viewchange', Views.updateView);

  },
  updateView: function(tab) {
    var tabID = (tab ? tab.id : spUI.activeView);

    _.findWhere(Views.tabs, {
      id: tabID
    }).controller.updateView();
  },
  reset: function() {
    Header.reset();
    Views.tabBar.reset();
  }
};