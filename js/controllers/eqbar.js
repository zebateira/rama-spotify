require([
  'js/controllers/controller#controller',
  '$api/audio',
  '$api/models'
], function(Controller, audio, models) {

  var EQBar = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      if (!config)
        return;

      this.numRows = config.numRows;
      this.barHeightFactor = 100.0;
      this.barwidth = 3.0;
    }
  });

  EQBar.implement({
    loadController: function() {

      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');

      $(this.selector).append(this.canvas);

      this.context.fillStyle = "#dfe0e6";

      audio.RealtimeAnalyzer.forPlayer(models.player)
        .addEventListener('audio', this.onRealtimeAudio.bind(this));
    },
    onRealtimeAudio: function(event) {
      var left = event.audio.wave.left;
      var right = event.audio.wave.right;

      this.context.clearRect(0, 0, 600, 600);

      for (var i = 0, x = 0; i < this.numRows; i++, x += this.barwidth + 0.5) {
        var height =
          (Math.abs(left[i]) + Math.abs(right[i])) * this.barHeightFactor;

        this.context.fillRect(x, -1, this.barwidth, height);
      }
    },
    updateView: function() {},
  });

  exports.eqbar = EQBar;
});