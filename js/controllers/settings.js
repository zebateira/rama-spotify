require([
  'js/controllers/controller#controller',
  'js/models/element#element'
], function(Controller, Element) {

  var Settings = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.selectors = config.selectors;

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
          this.selectors.form + ' input[name=' + input + ']';
      }
    }
  });

  Settings.implement({
    loadController: function() {
      this.button = new Element(this.selectors.button);
      this.form = new Element(this.selectors.form);

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