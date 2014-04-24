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

      var self = this;
      audio.RealtimeAnalyzer.forPlayer(models.player)
        .addEventListener('audio', function(evt) {
          self.onAudio(evt, self);
        });
    },
    onAudio: function(event, self) {
      var left = event.audio.wave.left;
      var right = event.audio.wave.right;
      var barHeightFactor = 60;

      for (var i = 0; i < self.numRows; i++) {
        self.bars[i].style.height =
          (left[i] + right[i]) * barHeightFactor + 'px';
      }
    },
    updateView: function() {},
  });

  exports.eqbar = EQBar;
});