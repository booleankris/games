
/**
 * @author  raizensoft.com
 */
define([
  'rs/bp3d/ui/GameButton'
],
  function(GameButton) {

    "use strict";

    /**
     * GameScreenButtonBar class
     * @class GameScreenButtonBar
     * @constructor
     */
    function GameScreenButtonBar(gs) {

      this.gs = gs;
      this.init();
    }

    /**
     * Init the buttons
     * @method init
     */
    GameScreenButtonBar.prototype.init = function() {

      // Root container
      var el = this.el = document.createElement('div');
      el.className = 'rs-bp3d-gamebuttonbar';

      var am = this.gs.bp3d.assetManager;

      // Hint button
      this.hintBtn = new GameButton('icon-eye', this.showHint.bind(this));

      this.hintBtn.addClass('rs-bp3d-mainbutton-extra');
      el.appendChild(this.hintBtn.el);

      // Game level button
      this.levelBtn = new GameButton('icon-stack', this.showGameLevels.bind(this));
      this.levelBtn.addClass('rs-bp3d-mainbutton-extra');
      el.appendChild(this.levelBtn.el);

      // Game mode button
      this.modeBtn = new GameButton('icon-mode', this.showCategory.bind(this));
      this.modeBtn.addClass('rs-bp3d-mainbutton-extra');
      el.appendChild(this.modeBtn.el);

      // Info Button
      this.infoBtn = new GameButton('icon-info', this.showHelp.bind(this));
      el.appendChild(this.infoBtn.el);

      // Home Button
      this.homeBtn = new GameButton('icon-home', this.showHome.bind(this));
      el.appendChild(this.homeBtn.el);

      // Sound control button
      this.soundBtn = new GameButton('icon-sound-on', this.toggleSound.bind(this));
      this.soundBtn.isOn = true;
      el.appendChild(this.soundBtn.el);
    };

    /**
     * Show button bar
     * @method show
     */
    GameScreenButtonBar.prototype.show = function() {

      anime({
        targets:this.el,
        bottom:15,
        easing:'easeOutQuint',
        duration:800
      });
    };

    /**
     * Hide button bar
     * @method hide
     */
    GameScreenButtonBar.prototype.hide = function() {

      anime({
        targets:this.el,
        bottom:-50,
        easing:'easeOutQuint',
        duration:800
      });
    };

    /**
     * Show image hint
     * @method showHint
     */
    GameScreenButtonBar.prototype.showHint = function() {

      var am = this.gs.bp3d.assetManager;
      this.gs.imagePanel.show(this.gs.getCurrentImagePath());
      am.btnClick.play();
    };

    /**
     * Show levels selector
     * @method showGameLevels
     */
    GameScreenButtonBar.prototype.showGameLevels = function() {

      if (this.gs.game3d.container.isShuffling) return;
      var am = this.gs.bp3d.assetManager;
      am.btnClick.play();
      this.gs.levelPanel.show();
    };

    /**
     * Show category
     * @method showCategory
     */
    GameScreenButtonBar.prototype.showCategory = function(e) {

      var am = this.gs.bp3d.assetManager;
      am.btnClick.play();
      this.gs.catPanel.show();
    };

    /**
     * Show home page
     * @method showHome
     */
    GameScreenButtonBar.prototype.showHome = function(e) {

      var am = this.gs.bp3d.assetManager;
      am.btnClick.play();
      this.gs.bp3d.setHomeScreen();
    };

    /**
     * Show help panel
     * @method showHelp
     */
    GameScreenButtonBar.prototype.showHelp = function(e) {

      var am = this.gs.bp3d.assetManager;
      am.btnClick.play();
      this.gs.hpanel.show();
    };

    /**
     * Toggle sound on/off
     * @method toggleSound
     */
    GameScreenButtonBar.prototype.toggleSound = function() {

      var am = this.gs.bp3d.assetManager;
      var btn = this.soundBtn;
      btn.isOn = !this.soundBtn.isOn;
      if (btn.isOn) {
        btn.removeClass('icon-sound-off');
        btn.addClass('icon-sound-on');
        am.btnClick.play();
      }
      else {
        btn.removeClass('icon-sound-on');
        btn.addClass('icon-sound-off');
      }
      am.toggleSound();
    };

    /**
     * Return client width and height
     * @method getClientSize
     */
    GameScreenButtonBar.prototype.getClientSize = function() {
      return [this.el.clientWidth, this.el.clientHeight];
    };

    return GameScreenButtonBar;

  });
