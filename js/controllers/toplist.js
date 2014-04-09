var TopList = function() {
  this.name = 'toplist';
};

TopList.prototype = {
  loadView: function() {

  },
  updateView: function() {

  }
};

TopList.prototype.constructor = TopList;

require([
  '$api/models'
], function(models) {
  exports.TopList = TopList;
});