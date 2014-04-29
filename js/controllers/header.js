require([
  'js/controllers/controller#controller'
], function(Controller) {

  var Header = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);
      this.applink = this.config.applink || false;
    }
  });

  Header.implement({
    afterLoad: function() {
      if (!this.applink)
        this.jelement.find('.header-link').hide();
      else
        this.jelement.find('.header-link > a')
          .attr('href', this.applink);
    }
  });

  exports.header = Header;
});