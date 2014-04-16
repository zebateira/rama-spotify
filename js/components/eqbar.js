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
    EQBar.step = 256 / EQBar.numRows;
  },
  loadView: function() {
    var numRows = EQBar.numRows;
    var bars = [];

    for (var i = 0; i < numRows * 2; i++) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      bar.min = -1;
      $(EQBar.selector).append(bar);

      bars.push(bar);
    }

    var analyzer = audio.RealtimeAnalyzer.forPlayer(models.player);

    analyzer.addEventListener('audio', function(evt) {
      for (var i = 0; i < numRows; i++) {
        bars[i * 2].style.height =
          evt.audio.wave.left[EQBar.step * i] * 100 + 'px';
        bars[i * 2 + 1].style.height =
          evt.audio.wave.right[EQBar.step * i] * 100 + 'px';
      }
    });

  },
  updateView: function() {

  },
  reset: function() {}
};