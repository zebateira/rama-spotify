require(['$api/models'], function(_models) {

  var Controller = new Class({
    initialize: function(name, config) {
      this.name = name;
      this.config = config;
      this.selector = config.selector;
    }
  });

  function afterLoad(controller) {
    return function() {
      controller.jelement = $(controller.selector);
      controller.element = controller.jelement[0];

      controller.afterLoad();
    };
  }

  Controller.implement({
    loadView: function() {
      if (this.config.loadtemplate) {
        $(this.selector).load(
          this.config.viewpath,
          afterLoad(this)
        );
      }
    },
    updateView: function() {}
  });

  exports.controller = Controller;
});