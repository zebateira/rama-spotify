require(['$api/models'], function(_models) {

  var Controller = new Class({
    initialize: function(name, config) {
      this.name = name;
      this.config = config;
      this.selector = config.selector;
    }
  });

  var Utils = {
    afterLoad: function(controller) {
      return function() {
        controller.jelement = $(controller.selector);
        controller.element = controller.jelement[0];
        console.log(controller);

        controller.afterLoad();
      };
    }
  };

  Controller.implement({
    loadView: function() {
      if (this.config.loadtemplate) {
        console.log(this.config.viewpath + ' on ' + this.selector);
        $(this.selector).load(
          this.config.viewpath,
          Utils.afterLoad(this)
        );
      } else
        Utils.afterLoad(this)();
    },
    updateView: function() {}
  });


  exports.controller = Controller;
  exports.utils = Utils;
});