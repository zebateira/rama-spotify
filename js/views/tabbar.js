 var TabsMissingException;
 var TabInfoMissingException;
 var TabMissingControllerException;

require(['$views/ui', 'js/exceptions'], function(ui, _exceptions) {
  exports.init = TabBar.init;
  exports.load = TabBar.load;
  exports.reset = TabBar.reset;
  exports.tabs = TabBar.tabs;


  TabsMissingException = _exceptions.TabsMissingException;
  TabInfoMissingException = _exceptions.TabInfoMissingException;
  TabMissingControllerException = _exceptions.TabMissingControllerException;
});

var TabBar = {
  init: function(tabs) {
    if (!(tabs instanceof Array))
      throw new TabsMissingException();

    TabBar.tabs = tabs;

    _.each(TabBar.tabs, function(tab) {
      if (!tab.viewId || !tab.name)
        throw new TabInfoMissingException(tab);

      tab.id = tab.viewId;
      tab.element = document.getElementById(tab.id);
      tab.path = tab.path || TabBar._getDefaultPath(tab.viewId);

      if (!tab.controller || tab.controller === undefined || (typeof tab.controller.init) !== 'function')
        throw new TabMissingControllerException();

      tab.controller.init(tab.id, tab.path);
    });
  },
  load: function() {
    _.each(TabBar.tabs, function(tab) {
      tab.controller.loadView();
    });
  },
  reset: function() {
    TabBar.tabs = {};
  },
  _getDefaultPath: function(tabID) {
    return Views.DEFAULT_PATH + tabID + '.html';
  }
};