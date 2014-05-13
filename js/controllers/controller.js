require(['$api/models', 'js/components#Components'], function(models, Components) {

  var Controller = new Class({
    initialize: function(name, config) {
      this.name = name;
      this.config = config;
      this.selector = config.selector;
    }
  });

  function afterLoad(controller, supports) {
    return function(dependency) {
      controller.jelement = $(controller.selector);
      controller.element = controller.jelement[0];

      controller.afterLoad(dependency);

      if (!supports)
        return;

      for (var i = 0; i < supports.length; ++i) {
        var support = Components.components[supports[i]];
        if (support && support.controller) {
          support.controller.loadView(support.supports, controller);
        }
      }
    };
  }

  Controller.implement({
    loadView: function(supports, dependency) {
      if (this.config.loadtemplate) {
        var controller = this;
        $(this.selector).load(
          this.config.viewpath,
          function() {
            afterLoad(controller, supports)(dependency);
          }
        );
      } else
        afterLoad(this, supports)(dependency);
    },
    updateView: function() {},
  });

  exports.controller = Controller;
});