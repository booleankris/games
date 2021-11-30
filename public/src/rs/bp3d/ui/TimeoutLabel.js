
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * TimeoutLabel
     * @class TimeoutLabel
     * @constructor
     */
    function TimeoutLabel() {
      this.init();
    }

    /**
     * Init the label
     * @method init
     */
    TimeoutLabel.prototype.init = function() {

      var el = document.createElement('div');
      el.className = 'rs-bp3d-timeout';
    };

    return TimeoutLabel;
  });
