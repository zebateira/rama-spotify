require([
  'js/controllers/header#header',
  'js/controllers/graphcontroller#graphcontroller'
], function(_header, _graphcontroller) {

  exports.Header = _header;
  exports.GraphController = _graphcontroller;
});