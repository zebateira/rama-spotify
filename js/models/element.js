var Element = function(selector) {
  this.selector = selector;
  this.jelement = $(this.selector);
  this.element = this.jelement[0];
};

Element.createElements = function(selectors) {
  var elements = {};

  _.each(selectors, function(selector, name) {
    elements[name] = new Element(selector);
  });

  return elements;
};

Element.resetAll = function(elements) {
  _.each(elements, function(element) {
    element.reset();
  });
};

Element.prototype = {
  addDOMEvent: function(config) {
    this.element[config.eventName] =
      config.handler.bind(config.context);
  },
  reset: function() {
    this.jelement.html('');
  }
};

Element.prototype.constructor = Element;

require(['$api/models'], function(_models) {
  exports.element = Element;
});