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
  '$api/toplists',
  '$views/list'
], function(toplists, vlist) {
  exports.TopList = TopList;
});