require([
  'js/controllers/header#header',
  'js/controllers/graphcontroller#graphcontroller',
  'js/controllers/settings#settings'
], function(_header, _graphcontroller, _settings) {

  exports.Header = _header;
  exports.GraphController = _graphcontroller;
  exports.Settings = _settings;
});