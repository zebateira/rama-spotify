/** 
  DOM Element Wrapper
*/

var Element = function(selector) {
  this.selector = selector;
  this.jelement = $(this.selector);
  this.element = this.jelement[0];
};

// Instance only methods
Element.prototype = {
  addDOMEvent: function(config) {
    this.element[config.eventName] =
      config.handler.bind(config.context);
  },
  html: function(html) {
    this.jelement.html(html);
  },
  reset: function() {
    this.jelement.html('');
  }
};

Element.prototype.constructor = Element;

// Object only methods
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

require(['$api/models'], function(_models) {
  exports.element = Element;
});