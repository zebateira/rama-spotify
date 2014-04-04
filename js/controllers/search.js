var Search = function() {
  this.name = 'search';
};

Search.prototype = {
  loadView: function() {

  },
  updateView: function() {

  }
};

Search.prototype.constructor = Search;

require([
  '$api/models'
], function(models) {
  exports.Search = Search;
});