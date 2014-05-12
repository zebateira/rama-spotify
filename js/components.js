/**
  Components module

  Handles the views for the header, graph and all the menus
  */

// imported modules
var UI;

var Components = {
  DEFAULT_PATH: '../views/',
  DEFAULT_TEMPLATE: '.html',
  DEFAULT_SELECTOR_PREFIX: '#',

  components: {},

  initConfig: function(initConfig) {
    this.config = {
      viewspath: initConfig.config.viewspath || Components.DEFAULT_PATH,
      template: initConfig.config.template || Components.DEFAULT_TEMPLATE,
      selectorPrefix: initConfig.config.selectorPrefix || Components.DEFAULT_SELECTOR_PREFIX
    };

    this.components = initConfig.components;

    for (var componentName in this.components) {
      var component = this.components[componentName];

      component.selector = component.selector ||
        Components.DEFAULT_SELECTOR_PREFIX + componentName;

      if (component.loadtemplate) {
        component.viewpath = component.viewpath ||
          Components.DEFAULT_PATH + componentName + Components.DEFAULT_TEMPLATE;
      }

      if (component.controller) {
        component.controller =
          new component.controller(componentName, component);
        component.controller.component = component;
      }

      this.components[componentName] = component;
    }
  },
  loadViews: function(config) {
    Components.spUI = UI.init({});

    for (var componentName in this.components) {
      var component = this.components[componentName];
      if (component.controller && !component.hasDependencies) {
        var controller = component.controller;

        controller.loadView(this.components[component.supports]);
      }
    }
  },
  updateViews: function(data) {
    for (var componentName in Components.components) {
      var comp = Components.components[componentName];

      if (comp.controller) {
        comp.controller.updateView();
      }
    }
  },
  reset: function() {},
};

// exporting module

require([
  '$views/ui#UI',
], function(_ui) {
  UI = _ui;

  exports.Components = Components;
});