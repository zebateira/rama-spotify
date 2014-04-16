var EQBar = {};
var audio;
var models;

require(['$api/audio', '$api/models'], function(_audio, _models) {
  audio = _audio;
  models = _models;

  exports.eqbar = EQBar;
});


EQBar = {
  init: function(config, defaultPath) {
    if (!config)
      return;

    EQBar.selector = config.selector;
    EQBar.numRows = config.numRows;
  },
  loadView: function() {
    var numRows = EQBar.numRows;
    var bars = [];

    for (var i = 0; i < numRows * 2; i++) {
      var bar = document.createElement('meter');
      bar.min = -1;
      $(EQBar.selector).append(bar);

      bars.push(bar);
    }

    var analyzer = audio.RealtimeAnalyzer.forPlayer(models.player);

    analyzer.addEventListener('audio', function(evt) {
      // There will be 256 samples, but we want to only display every [step]
      // samples because we have fewer than 256 rows.
      var step = 256 / numRows;
      for (var i = 0; i < numRows; i++) {
        bars[i * 2].value = evt.audio.wave.left[step * i];
        bars[i * 2 + 1].value = evt.audio.wave.right[step * i];
      }
    });

  },
  updateView: function() {

  },
  reset: function() {}
};