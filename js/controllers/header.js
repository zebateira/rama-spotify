var Controller;


require([
  'js/controllers/controller#controller'
], function(_controller) {
  Controller = _controller;

  function Header(name, config) {
    this.name = name;
    this.config = config;
    this.events = config.events;

    this.selector = config.selector;
  }

  Header.prototype.constructor = Header;

  Header.prototype = {
    init: function() {
      this.link = this.config.applink || false;
    }
  };

  exports.header = Header;
});