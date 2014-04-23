var Settings;

require(['$api/models'], function(_models) {
  exports.settings = Settings;
});

Settings = {
  DEFAULT_SELECTOR: '#settings',

  init: function(config, defaultPath) {
    if (!config)
      return;

    Settings.selector = config.selector;
    Settings.path = config.path || defaultPath;
  },
  loadView: function() {}
};