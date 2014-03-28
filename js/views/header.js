require(['$views/ui'], function(ui) {
  exports.init = Header.init;
  exports.load = Header.load;
  exports.reset = Header.reset;
});

var Header = {
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
  reset: function() {
    Header.path = '';
    Header.link = '';
  }
};