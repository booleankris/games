
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * DurationBar
     * @class DurationBar
     * @constructor
     */
    function DurationBar(gh) {

      this.gh = gh;
      this.init();
    }

    /**
     * Build the component
     * @method init
     */
    DurationBar.prototype.init = function() {

      var el = document.createElement('div');
      this.el = el;
      el.className = 'rs-bp3d-dbar';

      // Progress bar
      this.bar = document.createElement('div');
      this.bar.className = 'progress-bar';
      el.appendChild(this.bar);

      // Label
      this.label = document.createElement('div');
      this.label.className = 'duration-label';
      this.label.innerHTML = 100;
      el.appendChild(this.label)
    };

    /**
     * Set bar value
     * @method setValue
     */
    DurationBar.prototype.setValue = function(value) {

      anime({
        targets:this.bar,
        width:value * 100 + '%',
        easing:'linear',
        duration:1000
      });
    };

    /**
     * Set duration
     * @method setDuration
     */
    DurationBar.prototype.setDuration = function(duration) {
      this.duration = this.currentValue = this.label.innerHTML = duration;
    };

    /**
     * Start counter
     * @method start
     */
    DurationBar.prototype.start = function() {

      var db = this;

      clearInterval(this.counterId);
      this.counterId = setInterval(function() {

        db.currentValue -= 1;
        if (db.currentValue <= 0) {

          db.gh.gs.game3d.setLoseState();
          db.stop();
        }
        var p = db.currentValue / db.duration;
        db.bar.style.width = p * 100 + '%';
        db.label.innerHTML = db.currentValue;
      }, 1000);
    };

    /**
     * Stop counter
     * @method stop
     */
    DurationBar.prototype.stop = function() {
      clearInterval(this.counterId);
    };

    /**
     * Reset
     * @method reset
     */
    DurationBar.prototype.reset = function() {
      this.bar.style.width = '100%';
    };

    return DurationBar;

  });
