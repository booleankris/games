
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * HeaderLevelButton component
     * @class HeaderLevelButton
     * @constructor
     */
    function HeaderLevelButton(gh) {
      this.gh = gh;
      this.init();
    }

    /**
     * Init the button
     * @method init
     */
    HeaderLevelButton.prototype.init = function() {

      var el = this.el = document.createElement('div');
      el.className = 'rs-bp3d-levelbtn';

      var gh = this.gh;
      this.el.addEventListener('click', function(e) {
        var g3d = gh.gs.game3d;
        g3d.shuffle();
      });

      // Label
      this.label = document.createElement('span');
      this.label.className = 'levelbtn-label';
      el.appendChild(this.label);

      // Shuffle button
      this.btn = document.createElement('span');
      this.btn.className = 'levelbtn-shuffle icon-shuffle';
      el.appendChild(this.btn);

      this.setLevel(1);
    };

    /**
     * Set current level label
     * @method setLevel
     */
    HeaderLevelButton.prototype.setLevel = function(level) {

      this.label.innerHTML = 'Level ' + level;
      function randColor () {
        return Math.floor(Math.random() * 150);
      }
      this.el.style.backgroundColor = 'rgba(' + randColor() + ', ' + randColor() + ', ' + randColor() + ', 1)';
    };

    return HeaderLevelButton;
  });
