/**
  Views module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var UI;
var Header;
var TabBar;

var Views = {};

// spotify exports
require([
  '$views/ui#UI',
  'js/views/header#header',
  'js/views/tabbar#tabbar'
], function(_ui, _header, _tabbar) {
  UI = _ui;

  Header = _header;
  TabBar = _tabbar;

  exports.views = Views;
});

Views = {
  DEFAULT_PATH: '../views/',

  initConfig: function(config) {
    Header.init(config.header, Views.DEFAULT_PATH);
    TabBar.init(config.tabs, Views.DEFAULT_PATH);
  },
  loadViews: function() {
    Views.spUI = UI.init({
      header: true,
      views: TabBar.tabs,
      tabs: TabBar.tabs
      // history: true
    });

    Header.load();
    TabBar.load();

    Views.spUI.addEventListener('viewchange', Views.updateView);
  },
  updateViews: function(tab) {
    var tabID = tab ? tab.id : Views.spUI.activeView;

    Header.updateView();
    TabBar.updateView(tabID);
  },
  reset: function() {
    Header.reset();
    TabBar.reset();
  }
};