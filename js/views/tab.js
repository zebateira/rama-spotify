require(['$api/models'], function(models) {

  var Tab = function() {

  };

  var View = function() {

  };

  View.prototype = {
    load: function() {
      console.log('view: load not overwritten!');
    },
    update: function() {
      console.log('view: update not overwritten!');
    },
    reset: function() {
      console.log('view: reset not overwritten!');
    }
  };

});