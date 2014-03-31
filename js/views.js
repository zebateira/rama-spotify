/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var UI;
var Header;
var TabBar;

// spotify exports
require([
  '$views/ui#UI',
  'js/views/header#header',
  'js/views/tabbar#tabbar'
], function(_ui, _header, _tabbar) {
  UI = _ui;

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
    TabBar.init(config.tabs, Views.DEFAULT_PATH);
  },
  loadViews: function() {
    UI = UI.init({
      header: true,
      views: TabBar.tabs,
      tabs: TabBar.tabs
    });

    Header.load();
    TabBar.load();

    UI.addEventListener('viewchange', Views.updateView);

  },
  updateView: function(tab) {
    var tabID = (tab ? tab.id : UI.activeView);

    _.findWhere(TabBar.tabs, {
      id: tabID
    }).controller.updateView();
  },
  reset: function() {
    Header.reset();
    TabBar.reset();
  }
};