/**
  Compilation of the available controllers.
  Each controller should apply to a UI component.
*/

require([
  'js/controllers/graphcontroller#graphcontroller',
  'js/controllers/settings#settings',
  'js/controllers/eqbar#eqbar',
  'js/controllers/tracklist#tracklist',
  'js/controllers/artistmenu#artistmenu',
  'js/controllers/tagsmenu#tagsmenu',
], function(
  _graphcontroller,
  _settings,
  _eqbar,
  _tracklist,
  _artistmenu,
  _tagsmenu
) {
  exports.GraphController = _graphcontroller;
  exports.Settings = _settings;
  exports.EQBar = _eqbar;
  exports.TrackList = _tracklist;
  exports.ArtistMenu = _artistmenu;
  exports.TagsMenu = _tagsmenu;
});