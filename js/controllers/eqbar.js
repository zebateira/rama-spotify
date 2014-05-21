require([
  'js/controllers/controller#controller',
  '$api/audio',
  '$api/models'
], function(Controller, audio, models) {

  var EQBar = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.numRows = config.numRows || 128;
      this.barHeightFactor = config.bar_height_factor || 100.0;
      this.barwidth = config.barwidth || 3.0;
      this.barmargin = config.barmargin || 0.5;

      this.elementWidth =
        this.numRows * (this.barwidth + this.barmargin);
    }
  });

  EQBar.implement({
    loadController: function() {

      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');

      $(this.selector).append(this.canvas);

      this.canvas.width = this.elementWidth;

      this.context.fillStyle = "#dfe0e6";

      audio.RealtimeAnalyzer.forPlayer(models.player)
        .addEventListener('audio', this.onRealtimeAudio.bind(this));
    },
    onRealtimeAudio: function(event) {
      var left = event.audio.wave.left;
      var right = event.audio.wave.right;

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (var i = 0, x = 0; i < this.numRows; i++, x += this.barwidth + this.barmargin) {
        var height =
          (Math.abs(left[i]) + Math.abs(right[i])) * this.barHeightFactor;
        this.context.fillRect(x, 0, this.barwidth, height);
      }
    },
    updateView: function() {},
  });

  exports.eqbar = EQBar;
});