var TabsMissingException;
var TabInfoMissingException;
var TabMissingControllerException;

var TabBar = {};

require(['$views/ui', 'js/exceptions'], function(ui, _exceptions) {
  TabsMissingException = _exceptions.TabsMissingException;
  TabInfoMissingException = _exceptions.TabInfoMissingException;
  TabMissingControllerException = _exceptions.TabMissingControllerException;

  exports.tabbar = TabBar;
});

TabBar = {
  init: function(tabs, defaultPath) {
    if (!(tabs instanceof Array))
      throw new TabsMissingException();

    TabBar.tabs = tabs;

    _.each(TabBar.tabs, function(tab) {
      if (!tab.viewId || !tab.name)
        throw new TabInfoMissingException(tab);

      tab.id = tab.viewId;
      tab.element = document.getElementById(tab.viewId);
      tab.path = tab.path || defaultPath + tab.viewId + '.html';

      if (!tab.controller || tab.controller === undefined ||
        (typeof tab.controller.init) !== 'function')
        throw new TabMissingControllerException();

      tab.controller.init(tab.viewId, tab.path);
    });
  },
  load: function() {
    _.each(TabBar.tabs, function(tab) {
      tab.controller.loadView();
    });
  },
  updateView: function(tabID) {
    _.findWhere(TabBar.tabs, {
      id: tabID
    }).controller.updateView();
  },
  reset: function() {
    TabBar.tabs = {};
  },

};