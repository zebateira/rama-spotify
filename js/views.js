/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var spUI;
var Header;
var TabBar;

// spotify exports
require([
  '$views/ui#UI',
  'js/views/header',
  'js/views/tabbar'
], function(ui, _header, _tabbar) {
  spUI = ui;

  Header = _header;
  TabBar = _tabbar;

  exports.initConfig = Views.initConfig;
  exports.loadViews = Views.loadViews;
  exports.updateView = Views.updateView;
});

var Views = {
  DEFAULT_PATH: '../views/',

  initConfig: function(config) {
    Header.init(config.header, Views.DEFAULT_PATH);
    TabBar.init(config.tabs);
  },
  loadViews: function() {
    spUI = spUI.init({
      header: true,
      views: TabBar.tabs,
      tabs: TabBar.tabs
    });

    Header.load();
    TabBar.load();

    spUI.addEventListener('viewchange', Views.updateView);

  },
  updateView: function(tab) {
    var tabID = (tab ? tab.id : spUI.activeView);

    _.findWhere(TabBar.tabs, {
      id: tabID
    }).controller.updateView();
  },
  reset: function() {
    Header.reset();
    TabBar.reset();
  }
};