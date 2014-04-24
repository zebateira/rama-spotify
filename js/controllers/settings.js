require([
  'js/controllers/controller#controller'
], function(Controller) {

  var Settings = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

    }
  });

  Settings.implement({
    afterLoad: function() {

    }

  });

  exports.settings = Settings;
});