var Element = function(selector) {
  this.selector = selector;
  this.jelement = $(selector);
  this.element = this.jelement[0];
};

Element.prototype = {
  addDOMEvent: function(config) {
    this.element[config.eventName] =
      config.handler.bind(config.context);
  }
};

Element.prototype.constructor = Element;

require(['$api/models'], function(_models) {
  exports.element = Element;
});