require(['$api/models'], function(_models) {
  exports.controller = {
    loadView: function(self) {

      if (self.config.loadtemplate) {

        $(self.selector).load(self.config.viewPath, function done(response, status, xhr) {
          self.jelement = $(this);
          self.element = this;

          self.events.afterLoad(self);
        });
      }
    },
    updateView: function() {
      this.events.updateView(this);
    }
  };
});