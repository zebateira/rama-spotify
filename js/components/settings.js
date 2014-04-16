var Element;

var Settings = function(config) {
  this.selector = config.selector || '.settings';
  this.viewpath = config.viewpath || '../views/settings.html';

  var self = this;

  this.form = {
    selector: config.formSelector || this.selector + ' .settings-form',
  };

  for (var input in Settings.INPUTS) {
    Settings.INPUTS[input].selector =
      this.form.selector + ' input[name=' + input + ']';
  }

  this.button = {
    selector: config.buttonSelector || this.selector + ' .settings-btn'
  };
};

Settings.INPUTS = {
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

Settings.prototype = {
  loadView: function(events) {
    var self = this;

    $(this.selector).load(this.viewpath, function() {

      self.jelement = $(self.selector);
      self.element = self.jelement[0];

      self.form = new Element(self.form.selector);
      self.button = new Element(self.button.selector);

      self.button.element.onclick = function(event) {
        self.button.jelement.toggleClass('opened');
        self.form.jelement.toggle();
      };

      _.each(events, function(eventHandler) {
        self[eventHandler.name](eventHandler);
      });
    });
  },

  reset: function() {},

  // events 
  onChangeValue: function(eventHandler) {
    _.each(Settings.INPUTS, function(input) {
      $(input.selector).on('change', function() {
        eventHandler(this.name, this[input.value]);
      });
    });
  }
};

Settings.prototype.constructor = Settings;

require(['js/models/element#Element'], function(_element) {
  Element = _element;
  exports.Settings = Settings;
});