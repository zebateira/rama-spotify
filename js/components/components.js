/**
  Components module

  Handles the views for the header, tabs bar, tabs content, etc...
*/

// imported modules
var UI;
var Header;
var TabBar;
var EQBar;
var PlayQueue;

var Components = {
  DEFAULT_PATH: '../views/',

  initConfig: function(config) {
    Header.init(config.header, Components.DEFAULT_PATH);
    TabBar.init(config.tabs, Components.DEFAULT_PATH);
    EQBar.init(config.eqbar, Components.DEFAULT_PATH);
    PlayQueue.init(config.playqueue);
  },
  loadViews: function(config) {
    Components.spUI = UI.init({
      header: true,
      views: TabBar.tabs,
      tabs: TabBar.tabs
    });
    Header.loadView();
    TabBar.loadView();
    EQBar.loadView();
    PlayQueue.loadView();

    Components.bindEvents(config.events);
  },
  updateViews: function(data) {
    var tabID = data.id || Components.spUI.activeView;
    Header.updateView();
    TabBar.updateView(tabID);
  },
  reset: function() {
    Header.reset();
    TabBar.reset();
  },

  // events

  bindEvents: function(events) {
    for (var event in events) {
      Components.on(event, events[event]);
    }
  },
  events: {
    windowresize: {
      bind: function(eventHandler) {
        window.onresize = eventHandler;
      }
    },
    viewchange: {
      bind: function(eventHandler) {
        Components.spUI.addEventListener('viewchange', eventHandler);
      }
    }
  },
  on: function(event, eventHandler) {
    Components.events[event].bind(eventHandler);
  }
};

// exporting module

require([
  '$views/ui#UI',
  'js/components/header#header',
  'js/components/tabbar#tabbar',
  'js/components/eqbar#eqbar',
  'js/components/playqueue#playqueue'
], function(_ui, _header, _tabbar, _eqbar, _playqueue) {
  UI = _ui;

  Header = _header;
  TabBar = _tabbar;
  EQBar = _eqbar;
  PlayQueue = _playqueue;

  exports.Components = Components;
});