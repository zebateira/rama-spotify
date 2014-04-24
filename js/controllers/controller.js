require(['$api/models'], function(_models) {

  var Controller = new Class({
    initialize: function(name, config) {
      this.name = name;
      this.config = config;
      this.selector = config.selector;
    }
  });

  var Utils = {
    afterLoad: function(controller, supports) {
      return function(dependency) {
        controller.jelement = $(controller.selector);
        controller.element = controller.jelement[0];

        controller.afterLoad(dependency);

        if (supports && supports.controller)
          supports.controller.loadView(null, controller);
      };
    }
  };

  Controller.implement({
    loadView: function(supports, dependency) {
      if (this.config.loadtemplate) {
        $(this.selector).load(
          this.config.viewpath,
          Utils.afterLoad(this, supports)
        );
      } else
        Utils.afterLoad(this, supports)(dependency);
    },
    updateView: function() {}
  });


  exports.controller = Controller;
  exports.utils = Utils;
});