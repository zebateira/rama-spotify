require([
  '$api/models',
  'js/components#Components'
], function(models, Components) {

  /**
    Controller Object

    Generic controller object
  */
  var Controller = new Class({
    // constructor
    initialize: function(name, config) {
      this.name = name;
      this.config = config;
      this.selector = config.selector;
    }
  });

  // class specific methods
  Controller.implement({

    // Controller.loadView
    //    To be called by components.Components
    //    Loads template from file if available.
    //    When view is ready, afterLoad helper function is called
    loadView: function(supports, dependency) {

      if (this.config.loadtemplate) {

        $(this.selector).load(
          this.config.viewpath,
          afterLoad(this, supports, dependency));

      } else
        afterLoad(this, supports, dependency)();

    }

  });

  // helper function for setting configurations
  // after the loadView function as finished
  function afterLoad(controller, supports, dependency) {
    return function() {
      controller.jelement = $(controller.selector);
      controller.element = controller.jelement[0];

      if (controller.afterLoad)
        controller.afterLoad(dependency);

      if (!supports)
        return;

      // call loadView on all the controllers that depend on
      // this controller.
      for (var i = 0; i < supports.length; ++i) {
        var support = Components.components[supports[i]];
        if (support && support.controller) {
          support.controller.loadView(support.supports, controller);
        }
      }
    };
  }

  exports.controller = Controller;
});