var HeaderMissingException = function() {
  this.message = "Header must be configured in views' options";

  this.toString = function() {
    return this.message;
  };
};

require(['$api/models'], function(models) {
  exports.HeaderMissingException = HeaderMissingException;
});