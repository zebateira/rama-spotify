var ConfigObjectMissing = function() {
  this.name = 'ConfigObjectMissing';
  this.message = 'Config object is missing from the main config object';
};

ConfigObjectMissing.prototype = new Error();
ConfigObjectMissing.prototype.constructor = ConfigObjectMissing;

var HeaderMissingException = function() {
  this.name = 'HeaderMissingException';
  this.message = 'Header must be configured in views\' options. ' +
    'A simple \'true\' value is enough';
};

HeaderMissingException.prototype = new Error();
HeaderMissingException.prototype.constructor = HeaderMissingException;

var TabsMissingException = function() {
  this.name = 'TabsMissingException';
  this.message = 'Array of tabs must be configured.';
};

TabsMissingException.prototype = new Error();
TabsMissingException.prototype.constructor = TabsMissingException;


var TabInfoMissingException = function(tab) {
  this.name = 'TabInfoMissingException';

  this.message = 'Info missing: ' + (tab.viewId ? '' : 'viewId') + (tab.name ? '.' : ', name.');
};

TabInfoMissingException.prototype = new Error();
TabInfoMissingException.prototype.constructor = TabInfoMissingException;

var TabMissingControllerException = function() {
  this.name = 'TabMissingControllerException';
  this.message = 'Tab is missing a controller for the view.';
};

TabMissingControllerException.prototype = new Error();
TabMissingControllerException.prototype.constructor = TabMissingControllerException;


require(['$api/models'], function(models) {
  exports.ConfigObjectMissing = ConfigObjectMissing;

  exports.HeaderMissingException = HeaderMissingException;
  exports.TabsMissingException = TabsMissingException;
  exports.TabInfoMissingException = TabInfoMissingException;
  exports.TabMissingControllerException = TabMissingControllerException;
});