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
    var barHeightFactor = 80;

    for (var i = 0; i < numRows * 2; i++) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      bar.min = -1;
      $(EQBar.selector).append(bar);

      bars.push(bar);
    }

    var analyzer = audio.RealtimeAnalyzer.forPlayer(models.player);

    analyzer.addEventListener('audio', function(evt) {
      var left = evt.audio.wave.left;
      var right = evt.audio.wave.right;

      for (var i = 0; i < numRows; i++) {
        bars[i * 2].style.height =
          left[i] * barHeightFactor + 'px';
        bars[i * 2 + 1].style.height =
          right[i] * barHeightFactor + 'px';
      }
    });

  },
  updateView: function() {

  },
  reset: function() {}
};