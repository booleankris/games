
/**
 * @author  raizensoft.com
 */
define([
  'rs/game/Scroller',
  'rs/game/BasePanel'
],
  function(Scroller, BasePanel) {

    "use strict";

    LevelPanel.prototype = Object.create(BasePanel.prototype);
    LevelPanel.prototype.constructor = LevelPanel;

    /**
     * LevelPanel
     * @class LevelPanel
     * @constructor
     */
    function LevelPanel(gs) {

      this.gs = gs;
      this.am = gs.bp3d.assetManager;
      BasePanel.prototype.constructor.call(this);
      this.currentCategory = -1;
    }

    /**
     * Init sub components
     * @method init
     */
    LevelPanel.prototype.init = function() {

      BasePanel.prototype.init.call(this);
      var el = this.el;
      this.el.classList.add('rs-bp3d-levelpanel');
      el.style.width = el.style.height = '90%';

      // Level title
      var lt = this.levelTitle = document.createElement('div');
      lt.className = 'trophy-level-title';
      lt.innerHTML = 'Levels';

      // Level grid container
      var lgc = this.lgc = document.createElement('div');
      lgc.className = 'rs-bp3d-levelgridcontainer';
      el.appendChild(lgc);

      // Level grid
      this.lg = document.createElement('div');
      this.lg.className = 'rs-bp3d-levelgrid';
      lgc.appendChild(this.lg);

      this.scroller = new Scroller(this.lgc);
    };

    /**
     * Show panel
     * @method show
     */
    LevelPanel.prototype.show = function() {

      BasePanel.prototype.show.call(this);
      document.body.appendChild(this.levelTitle);
      //if (this.currentCategory !== this.gs.currentCategory)
      this.buildGrid();
    };
    
    /**
     * Hide the panel
     * @method hide
     */
    LevelPanel.prototype.hide = function() {

      BasePanel.prototype.hide.call(this);
      if (document.body.contains(this.levelTitle))
        document.body.removeChild(this.levelTitle);
    };

    /**
     * Build grid based on current content data
     * @method buildGrid
     */
    LevelPanel.prototype.buildGrid = function() {

      var catData = this.gs.levels[this.gs.currentCategory];
      var length = catData.content.length;
      var lg = this.lg;
      var gs = this.gs;
      var pref = this.gs.bp3d.pref;

      lg.textContent = '';

      function clickHandler (e) {
        
        var idx = e.currentTarget.index;
        if (pref.isUnlocked(catData.name, idx)) {
          gs.loadLevel(idx);
        };
        gs.bp3d.assetManager.btnClick.play();
      }

      for (var i = 0; i < length; i++) {

        var gi = document.createElement('div');
        gi.className = 'rs-bp3d-levelgriditem';
        gi.index = i;
        if (pref.isUnlocked(catData.name, i)) {
          gi.innerHTML = '<span>' + (i + 1) + '</span>';
          gi.unlocked = true;
        }
        else {
          gi.innerHTML = '<span class="icon-lock"></span>';
          gi.unlocked = false;
        }
        lg.appendChild(gi);
        gi.addEventListener('click', clickHandler);
      }
      cancelAnimationFrame(this.scrollId);
      this.lgc.scrollTop = 0;

      // Resize level grid
      var tw = (Math.floor(this.lg.clientWidth / 96) * 96);
      this.lg.style.width = tw + 'px';
      this.currentCategory = this.gs.currentCategory;
    };

    return LevelPanel;

  });
