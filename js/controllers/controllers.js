require([
  'js/controllers/header#header',
  'js/controllers/graphcontroller#graphcontroller',
  'js/controllers/settings#settings',
  'js/controllers/eqbar#eqbar',
  'js/controllers/tracklist#tracklist',
  'js/controllers/artistmenu#artistmenu'
], function(
  _header,
  _graphcontroller,
  _settings,
  _eqbar,
  _tracklist,
  _artistmenu
) {

  exports.Header = _header;
  exports.GraphController = _graphcontroller;
  exports.Settings = _settings;
  exports.EQBar = _eqbar;
  exports.TrackList = _tracklist;
  exports.ArtistMenu = _artistmenu;
});