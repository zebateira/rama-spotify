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
    var barHeightFactor = 60;

    for (var i = 0; i < numRows; i++) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      $(EQBar.selector).append(bar);

      bars.push(bar);
    }

    var analyzer = audio.RealtimeAnalyzer.forPlayer(models.player);

    analyzer.addEventListener('audio', function(evt) {
      var left = evt.audio.wave.left;
      var right = evt.audio.wave.right;

      for (var i = 0; i < numRows; i++) {
        bars[i].style.height =
          (left[i] + right[i]) * barHeightFactor + 'px';
      }
    });

  },
  updateView: function() {

  },
  reset: function() {}
};