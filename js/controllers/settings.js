require([
  'js/controllers/controller#controller',
  'js/models/element#element'
], function(Controller, Element) {

  var Settings = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.button = {
        selector: config.buttonSelector || this.selector + ' .settings-btn'
      };

      this.settings = {
        selector: config.formSelector || this.selector + ' .settings-form',
      };

      this.inputs = {
        branching: {
          value: 'value'
        },
        depth: {
          value: 'value'
        },
        treemode: {
          value: 'checked'
        }
      };

      for (var input in this.inputs) {
        this.inputs[input].selector =
          this.settings.selector + ' input[name=' + input + ']';
      }
    }
  });

  Settings.implement({
    afterLoad: function() {
      this.button = new Element(this.button.selector);
      this.settings = new Element(this.settings.selector);

      var btn = this.button.jelement;
      var settings = this.settings.jelement;

      this.button.element.onclick = function(event) {
        btn.toggleClass('opened');
        settings.toggle();
      };
    }
  });

  exports.settings = Settings;
});