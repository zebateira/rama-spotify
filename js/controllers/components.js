/**
  Components module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var UI;
var Header;
var TabBar;

var Components = {};

require([
  '$views/ui#UI',
  'js/controllers/header#header',
  'js/controllers/tabbar#tabbar'
], function(_ui, _header, _tabbar) {
  UI = _ui;

  Header = _header;
  TabBar = _tabbar;

  exports.Components = Components;
});

Components = {
  DEFAULT_PATH: '../views/',

  initConfig: function(config) {
    Header.init(config.header, Components.DEFAULT_PATH);
    TabBar.init(config.tabs, Components.DEFAULT_PATH);
  },
  loadViews: function() {
    Components.spUI = UI.init({
      header: true,
      views: TabBar.tabs,
      tabs: TabBar.tabs
      // history: true
    });

    Header.load();
    TabBar.load();

    Components.spUI.addEventListener('viewchange', Components.updateViews);
  },
  updateViews: function(tab) {
    var tabID = tab ? tab.id : Components.spUI.activeView;

    Header.updateView();
    TabBar.updateView(tabID);
  },
  reset: function() {
    Header.reset();
    TabBar.reset();
  }
};