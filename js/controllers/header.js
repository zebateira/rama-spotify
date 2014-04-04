var HeaderMissingException;

var Header = {};

require(['$views/ui', 'js/exceptions'], function(ui, _exceptions) {
  exports.header = Header;

  HeaderMissingException = _exceptions.HeaderMissingException;
});

Header = {
  selector: '.sp-header',
  init: function(config, defaultPath) {
    if (!config)
      throw new HeaderMissingException();

    Header.DEFAULT_PATH =
      defaultPath + 'header.html';

    Header.link = config.link || false;
    Header.path = config.path || Header.DEFAULT_PATH;
  },
  load: function() {
    $(Header.selector)
      .load(Header.path, Header.afterLoad);
  },
  afterLoad: function() {
    if (!Header.link)
      $('.header-link', Header.selector).hide();
    else
      $('.header-link > a', Header.selector)
        .attr('href', Header.link);
  },
  updateView: function() {

  },
  reset: function() {
    Header.path = '';
    Header.link = '';
  }
};