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
    EQBar.bars = [];
  },
  loadView: function() {
    for (var i = 0; i < EQBar.numRows; i++) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      $(EQBar.selector).append(bar);

      EQBar.bars.push(bar);
    }

    audio.RealtimeAnalyzer.forPlayer(models.player)
      .addEventListener('audio', EQBar.updateView);
  },
  updateView: function(event) {
    var left = event.audio.wave.left;
    var right = event.audio.wave.right;
    var barHeightFactor = 60;

    for (var i = 0; i < EQBar.numRows; i++) {
      EQBar.bars[i].style.height =
        (left[i] + right[i]) * barHeightFactor + 'px';
    }
  },
  reset: function() {}
};