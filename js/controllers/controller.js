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
          this.afterLoad.bind(this, supports, dependency));
      } else
        this.afterLoad(supports, dependency);
    },
    // helper function for setting configurations
    // after the loadView function as finished
    afterLoad: function(supports, dependency) {
      this.jelement = $(this.selector);
      this.element = this.jelement[0];

      if (this.loadController)
        this.loadController(dependency);

      if (!supports)
        return;

      // call loadView on all the controllers that depend on
      // this controller.
      for (var i = 0; i < supports.length; ++i) {
        var support = Components.components[supports[i]];
        if (support && support.controller) {
          support.controller.loadView(support.supports, this);
        }
      }

    },
    updateView: function() {

    }

  });

  exports.controller = Controller;
});