require([
  'js/controllers/controller#controller',
  '$api/audio',
  '$api/models'
], function(Controller, audio, models) {

  /**
    Controller for the Equalizer UI Component

    Extends the controllers.Controller generic class
  */
  var EQBar = function(name, config) {
    Controller.call(this, name, config);

    this.barcolor = config.barcolor || '#7e7e7e';

    // number of rows for the equalizer
    this.numRows = config.numRows || 128;
    // width of the bars in px
    this.barwidth = config.barwidth || 8.0;
    // margin between the bars in px
    this.barmargin = config.barmargin || 2.0;
    // height factor (scale factor) for the bars.
    // the wave values given for each bar are very small
    // (between -1.0 to 1.0 or so) so they are scaled with
    // this value to give them a visible height number
    this.barHeightFactor = config.bar_height_factor || 100.0;

    // width for the canvas element
    this.elementWidth =
      this.numRows * (this.barwidth + this.barmargin);
  };

  EQBar.prototype = Object.create(Controller.prototype);

  EQBar.prototype.loadController = function() {
    // initiate the canvas and attach it to its wrapper
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.querySelector(this.selector)
      .appendChild(this.canvas);

    // the canvas width must be set with an exact value
    // so as to center it horizontally
    this.canvas.width = this.elementWidth;

    // color of the bars
    this.context.fillStyle = this.barcolor;

    $(this.element).hide();
    this.realtimeEvent = this.events.onRealtimeAudio.bind(this);
  };


  EQBar.prototype.hide = function() {
    $(this.element).hide();

    audio.RealtimeAnalyzer.forPlayer(models.player)
      .removeEventListener('audio', this.realtimeEvent);
  };

  EQBar.prototype.show = function() {
    $(this.element).show();

    // bind event listener to get the waves
    // to render the equalizer
    audio.RealtimeAnalyzer.forPlayer(models.player)
      .addEventListener('audio', this.realtimeEvent);
  };

  // event that processes the wave at each instant (in realtime)
  EQBar.prototype.events = {
    onRealtimeAudio: function(event) {
      // the waves: left and right arrays
      var left = event.audio.wave.left;
      var right = event.audio.wave.right;

      console.log('its on');

      // at each frame clear the canvas
      this.context.clearRect(0, 0,
        this.canvas.width, this.canvas.height);

      // draw the bars given the waves' values
      for (var i = 0, x = 0; i < this.numRows; i++, x += this.barwidth + this.barmargin) {
        // each value of wave.left and wave.right are
        // values between -1.0 and 1.0 (smth like that) so
        // by doing Math.abs(left[i]) we preserve the values
        // even if they are negative.

        // height of the bar to draw
        var height =
        // we are ignoring if it's a left or right wave.
        // we just add them up and represent a bar with the left 
        // and the right values
        (Math.abs(left[i]) + Math.abs(right[i])) *
        // we use the scale factor to make the values visible
        this.barHeightFactor;

        // each bar is draw always at y=0, with the same width
        // the x value is updated give the same width and
        // the this.barmargin
        this.context.fillRect(x, 0, this.barwidth, height);
      }
    }
  };

  EQBar.prototype.contructor = EQBar;

  exports.eqbar = EQBar;
});