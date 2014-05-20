/**
  Components module

  Handles the ui components initialization and loading
*/
var Components = {

  // Default values for the components
  DEFAULT_PATH: '../views/',
  DEFAULT_TEMPLATE: '.html',
  DEFAULT_SELECTOR_PREFIX: '#',

  // Components object initial configuration for the UI components
  //
  // initConfig parameter should contain all of the options
  // and ui components configurations
  initConfig: function(initConfig) {

    // Global configuration options
    this.config = {
      // path of the view files templates
      viewspath: initConfig.config.viewspath || Components.DEFAULT_PATH,
      // format of the templates
      template: initConfig.config.template || Components.DEFAULT_TEMPLATE,
      // prefix for the DOM selectors
      selectorPrefix: initConfig.config.selectorPrefix ||
        Components.DEFAULT_SELECTOR_PREFIX
    };

    this.components = initConfig.components;

    // Configuration options for each component
    for (var componentName in this.components) {
      var component = this.components[componentName];

      // selector:
      //   DOM selector of the component's container.
      //   default: key value of specified component. example:
      //            header: { ... }
      //            selector = #header
      component.selector = component.selector ||
        Components.DEFAULT_SELECTOR_PREFIX + componentName;

      // loadtemplate:
      //   Should the template be loaded or not from the template
      //   file.
      if (component.loadtemplate) {
        // viewpath:
        //   Template path to load the it from.
        //   Overrides the default path.
        component.viewpath = component.viewpath ||
          Components.DEFAULT_PATH +
          componentName +
          Components.DEFAULT_TEMPLATE;
      }

      // controller:
      //   Controller object for the UI component. The object should
      //   be of type controllers.Controller and implement the
      //   afterLoad function handler.
      if (component.controller) {
        component.controller =
          new component.controller(componentName, component);
        component.controller.component = component;
      }

      this.components[componentName] = component;
    }
  },
  loadViews: function(config) {
    for (var componentName in this.components) {
      var component = this.components[componentName];

      // hasDependencies:
      //   Whether this component has dependencies or not.
      //   If it does, it will wait until all of its dependencies
      //   have finished the afterLoad function, to initialize.
      //   Related to the supports property.
      if (component.controller && !component.hasDependencies) {
        var controller = component.controller;

        // supports:
        //   Specifies the objects that this component supports.
        //   This means that only after this component's controller 
        //   finishes the afterLoad function, can the supported
        //   controllers be initialized. The supported controllers
        //   will get this controller in the afterLoad parameter.
        //   Related to the hasDependencies property.
        controller.loadView(component.supports);
      }
    }
  },

  // Simply calls the updateView function on all the UI components.
  updateViews: function() {
    for (var componentName in Components.components) {
      var comp = Components.components[componentName];

      if (comp.controller) {
        comp.controller.updateView();
      }
    }
  }
};

// Exports for the spotify's require system
require(['$views/ui#UI'], function(_ui) {
  exports.Components = Components;
});