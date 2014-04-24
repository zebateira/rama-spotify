require([
  'js/controllers/header#header',
  'js/controllers/graphcontroller#graphcontroller',
  'js/controllers/settings#settings',
  'js/controllers/eqbar#eqbar'
], function(_header, _graphcontroller, _settings, _eqbar) {

  exports.Header = _header;
  exports.GraphController = _graphcontroller;
  exports.Settings = _settings;
  exports.EQBar = _eqbar;
});