/**
  Components module

  Handles the views for the header, graph and all the menus
  */

// imported modules
var UI;
var Controller;

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

    this.components = Object.create(initConfig.components);

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
        component.controller.init();
        component.controller.component = component;
      }

      this.components[componentName] = component;
    }
  },
  loadViews: function(config) {
    Components.spUI = UI.init({});

    function afterLoad(self) {
      return function() {
        self.events.afterLoad(self);
      };
    }

    for (var componentName in this.components) {
      var component = this.components[componentName];

      if (component.controller) {
        var controller = component.controller;

        if (controller.config.loadtemplate) {
          $(controller.selector).load(
            controller.config.viewpath,
            afterLoad(controller)
          );
        }
        component.jelement = $(component.selector);
        component.element = component.jelement[0];
      }
    }

    Components.bindEvents(config.events);
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

  // events helpers
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
  'js/controllers/controller'
], function(_ui, _controller) {
  UI = _ui;
  Controller = _controller;

  exports.Components = Components;
});