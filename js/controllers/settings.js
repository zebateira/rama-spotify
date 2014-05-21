require([
  'js/controllers/controller#controller',
  'js/models/element#element'
], function(Controller, Element) {

  var Settings = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.button = {
        selector: config.buttonSelector ||
          this.selector + ' ' + Settings.DEFAULT_BUTTON_SELECTOR
      };

      this.form = {
        selector: config.formSelector ||
          this.selector + ' ' + Settings.DEFAULT_FORM_SELECTOR
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
          this.form.selector + ' input[name=' + input + ']';
      }
    }
  });

  Settings.DEFAULT_BUTTON_SELECTOR = '.settings-btn';
  Settings.DEFAULT_FORM_SELECTOR = '.settings-form';

  Settings.implement({
    loadController: function() {
      this.button = new Element(this.button.selector);
      this.form = new Element(this.form.selector);

      this.button.addDOMEvent({
        eventName: 'onclick',
        context: this,
        handler: function(event) {
          this.button.jelement.toggleClass('opened');
          this.form.jelement.toggle();
        }
      });
    }
  });

  exports.settings = Settings;
});