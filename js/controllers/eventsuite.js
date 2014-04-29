var EventSuite = function(suitename) {
  this.suitename = suitename;

  this.events = [];
};

EventSuite.prototype = {
  addEvent: function(eventName, eventHandler) {
    var newEvent = {};
    newEvent[eventName] = eventHandler;

    this.events.push(newEvent);
  }
};

EventSuite.prototype.constructor = EventSuite;

require(['$api/models'], function(_models) {
  exports.EventSuite = EventSuite;
});