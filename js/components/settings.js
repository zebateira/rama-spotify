var Settings = function(config) {
  this.selector = config.selector || '.settings';
  this.viewpath = config.viewpath || '../views/settings.html';

  var self = this;

  this.form = {
    selector: config.formSelector || this.selector + ' .settings-form'
  };

  this.form.getSelector = function(name) {
    return self.form.selector + ' input[name=' + name + ']';
  };

  var inputs = ['branching', 'depth', 'treemode'];
  this.form.inputs = {
    branching: {
      name: 'branching',
      selector: this.form.getSelector('branching')
    },
    depth: {
      name: 'depth',
      selector: this.form.getSelector('depth')
    },
    treemode: {
      name: 'treemode',
      selector: this.form.getSelector('treemode')
    }
  };

  this.button = {
    selector: config.buttonSelector || this.selector + ' .settings-btn'
  };


  this.button.onclick = function(event) {
    self.button.jelement.toggleClass('opened');
    self.form.jelement.toggle();
  };

};

Settings.prototype = {
  loadView: function(done) {
    var self = this;

    $(this.selector).load(this.viewpath, function() {
      self.jelement = $(self.selector);
      self.element = self.jelement[0];
      self.form.jelement = $(self.form.selector);
      self.form.element = self.form.jelement[0];
      self.button.jelement = $(self.button.selector);
      self.button.element = self.button.jelement[0];
      self.button.element.onclick = self.button.onclick;
      done();
    });
  },
  updateView: function() {},
  reset: function() {},

  onChangeValue: function(event, eventHandler) {
    $(this.form.inputs[event].selector).on('change', eventHandler);
  }
};

Settings.prototype.constructor = Settings;

require(['$api/models'], function(models) {
  exports.Settings = Settings;
});