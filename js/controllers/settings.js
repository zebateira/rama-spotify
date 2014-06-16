require([
  'js/controllers/controller#controller',
  'js/components#Components',
  'js/models/element#element'
], function(Controller, Components, Element) {

  /**
    Controller for the Settings UI Component
  */

  var Settings = function(name, config) {
    Controller.call(this, name, config);

    // inputs of the form
    // the value parameter refers to the DOM attribute of
    // the element to listen to changes (to update the graph)
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

    // generate selectors for each input
    for (var input in this.inputs) {
      this.inputs[input].selector =
        this.selectors.form + ' input[name=' + input + ']';
    }

  };

  Settings.prototype = Object.create(Controller.prototype);

  // Creates for each DOM Element a Element object and
  // sets their events
  Settings.prototype.loadController = function(graphcontroller) {
    // initiate the elements
    this.button = new Element(this.selectors.button);
    this.form = new Element(this.selectors.form);

    // bind events
    this.button.addDOMEvent({
      eventName: 'onclick',
      context: this,
      handler: function(event) {
        this.button.jelement.toggleClass('opened');
        this.form.jelement.toggle();
      }
    });

    // event for input change: for every input onchange,
    // update graph with new setting
    _.each(this.inputs, function(input) {
      input.element = document.querySelector(input.selector);

      input.element.onchange = function() {
        var config = {};

        config[this.name] = parseInt(this[input.value]) ||
          this[input.value];

        graphcontroller.updateGraph(config);
      };
    });

    this.equalizer = document.querySelectorAll('input[name="equalizer"]')[0];

    this.equalizer.onchange = function() {
      var eqbarController = Components.components.eqbar.controller;

      if (this.checked)
        eqbarController.show();
      else
        eqbarController.hide();
    };

  };

  Settings.prototype.constructor = Settings;

  exports.settings = Settings;
});