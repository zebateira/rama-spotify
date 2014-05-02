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
      this.bars = [];
      this.barHeightFactor = 60;
    }
  });

  EQBar.implement({
    afterLoad: function() {
      for (var i = 0; i < this.numRows; i++) {
        var bar = document.createElement('div');
        bar.className = 'bar';
        $(this.selector).append(bar);

        this.bars.push(bar);
      }

      audio.RealtimeAnalyzer.forPlayer(models.player)
        .addEventListener('audio', this.onRealtimeAudio.bind(this));
    },
    onRealtimeAudio: function(event) {
      var left = event.audio.wave.left;
      var right = event.audio.wave.right;

      for (var i = 0; i < this.numRows; i++) {
        this.bars[i].style.height =
          (left[i] + right[i]) * this.barHeightFactor + 'px';
      }
    },
    updateView: function() {},
  });

  exports.eqbar = EQBar;
});