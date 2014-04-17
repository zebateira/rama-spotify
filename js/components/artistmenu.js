/** 
  Artist Menu
*/
var ConfigObjectMissing;

var ArtistMenu = {
  init: function(config) {
    if (!config)
      throw new ConfigObjectMissing();

    ArtistMenu.path = config.path || '../views/artistmenu.html';
    ArtistMenu.selector = config.selector || '#artist-menu';
  },
  loadView: function() {
    $(ArtistMenu.selector).load(ArtistMenu.path);
  },
  updateView: function() {

  },
  reset: function() {
    ArtistMenu.path = '';
    ArtistMenu.selector = '';
  }
};

require(['js/exceptions'], function(_exceptions) {
  exports.artistmenu = ArtistMenu;

  ConfigObjectMissing = _exceptions.ConfigObjectMissing;
});