
/**
 * @author  raizensoft.com
 */
define([
  'rs/game/ImagePanel',
  'rs/bp3d/ui/TrophyPanel',
  'rs/bp3d/ui/LevelPanel',
  'rs/bp3d/ui/CategoryPanel',
  'rs/bp3d/ui/HelpPanel',
  'rs/bp3d/ui/GameScreenButtonBar',
  'rs/bp3d/ui/GameScreenWonBar',
  'rs/bp3d/ui/GameScreenLoseBar',
  'rs/bp3d/ui/GameScreenHeader',
  'rs/bp3d/Game3d'],
  function(
    ImagePanel,
    TrophyPanel,
    LevelPanel,
    CategoryPanel,
    HelpPanel,
    GameScreenButtonBar,
    GameScreenWonBar,
    GameScreenLoseBar,
    GameScreenHeader,
    Game3d) {

    "use strict";

    /**
     * main Game screen
     * @class GameScreen
     * @constructor
     */
    function GameScreen(bp3d, config) {

      this.bp3d = bp3d;
      this.config = bp3d.config;
      this.init();
    }

    /**
     * Init game screen components
     * @method init
     */
    GameScreen.prototype.init = function() {

      // Root element
      var gs = this;
      var el = this.el = document.createElement('div');
      el.className = 'rs-gscreen';
      el.style.width = el.style.height = '100%';
      el.style.display = 'none';

      // Setup level data
      var level = this.config.data.level;
      this.levels = [];
      for (var key in level) {
        this.levels.push({name:key, content:level[key]});
      }

      // Setup panels
      this.initPanel();

      // Header
      this.header = new GameScreenHeader(this);
      el.appendChild(this.header.el);
      
      // ButtonBar
      this.bbar = new GameScreenButtonBar(this);
      el.appendChild(this.bbar.el);

      // Wonbar
      this.wbar = new GameScreenWonBar(this);
      el.appendChild(this.wbar.el);

      // Wonbar
      this.lbar = new GameScreenLoseBar(this);
      el.appendChild(this.lbar.el);

      // Timeout label

      // Game3d
      this.game3d = new Game3d(this);
      el.appendChild(this.game3d.el);

      // Initial parameters
      this.currentLevel = 0;
    };

    /**
     * Init game panels
     * @method initPanel
     */
    GameScreen.prototype.initPanel = function() {

      // Image panel
      this.imagePanel = new ImagePanel();

      // Trophy panel
      this.trophyPanel = new TrophyPanel(this);

      // Level panel
      this.levelPanel = new LevelPanel(this);

      // Category panel
      this.catPanel = new CategoryPanel(this);

      // Help Panel
      if (this.bp3d.homeScreen )
        this.hpanel = this.bp3d.homeScreen.hpanel;
      else
        this.hpanel = new HelpPanel();
    };

    /**
     * Load a level index
     * @method loadLevel
     */
    GameScreen.prototype.loadLevel = function(levelIndex) {

      var gs = this;

      // Hide current panels
      this.trophyPanel.hide();
      this.levelPanel.hide();
      this.catPanel.hide();
      this.wbar.hide();
      this.lbar.hide();
      this.stopCounter();

      // Show active bar
      this.showButtonBar();

      // Show preloader
      this.bp3d.showPreloader();

      function onLoadCallback () {

        gs.bp3d.hidePreloader();
        gs.reset();
        gs.header.levelBtn.setLevel(levelIndex + 1);
        gs.header.timeBtn.resume();
      }

      this.game3d.loadLevel(levelIndex, onLoadCallback);
      this.currentLevel = levelIndex;
    };

    /**
     * Load a specific id
     * @method loadCategory
     */
    GameScreen.prototype.loadCategory = function(catId) {

      this.currentCategory = catId;
      this.loadLevel(0);
    };

    /**
     * Replay current level
     * @method replay
     */
    GameScreen.prototype.replayLevel = function() {
      this.loadLevel(this.currentLevel);
    };

    /**
     * Load next level
     * @method nextLevel
     */
    GameScreen.prototype.nextLevel = function() {

      // Hide current board
      var index = this.currentLevel + 1;
      var catData = this.levels[this.currentCategory];

      // Back to level 0
      if (index == catData.content.length)
        index = 0;
      this.loadLevel(index);
    };

    /**
     * Unlock the next level
     * @method unlockNextLevel
     */
    GameScreen.prototype.unlockNextLevel = function() {

      var index = this.currentLevel + 1;
      var catData = this.levels[this.currentCategory];

      // Back to level 0
      if (index < catData.content.length) {
        this.bp3d.pref.saveUnlock(catData.name, index);
      }
    };

    /**
     * Return current image path
     * @method getCurrentImagePath
     */
    GameScreen.prototype.getCurrentImagePath = function() {

      var cat = this.levels[this.currentCategory];
      var path = cat.content[this.currentLevel].path;
      if (path == undefined)
        path = this.game3d.container.puzzleBoard.dataUrl;
      return path;
    };

    /**
     * Reset meta component
     * @method reset
     */
    GameScreen.prototype.reset = function() {

      this.header.timeBtn.reset();
      this.header.moveBtn.reset();
      this.header.dbar.reset();
    };

    /**
     * Show game screen
     * @method show
     */
    GameScreen.prototype.show = function(level) {

      this.currentCategory = 0;
      this.bp3d.root.appendChild(this.el);
      this.transitionIn();
      var d = this.bp3d.getAppDimension();
      this.game3d.resize(d[0], d[1]);
      this.game3d.startRendering();
      if (level == undefined) level = 0;
      this.loadLevel(level);
    };

    /**
     * Hide game screen
     * @method hide
     */
    GameScreen.prototype.hide = function() {

      this.bp3d.root.removeChild(this.el);
      this.game3d.stopRendering();
    };

    /**
     * Show game won bar
     * @method showWonBar
     */
    GameScreen.prototype.showWonBar = function() {

      this.bbar.hide();
      var wbar = this.wbar;
      setTimeout(function() {
        wbar.show("Level Passed");
      }, 400);
    };

    /**
     * Show game lose bar
     * @method showLoseBar
     */
    GameScreen.prototype.showLoseBar = function() {

      this.bbar.hide();
      var lbar = this.lbar;
      setTimeout(function() {
        lbar.show("Time out");
      }, 400);
    };


    /**
     * Show button bar
     * @method showButtonBar
     */
    GameScreen.prototype.showButtonBar = function() {

      this.wbar.hide();
      var bbar = this.bbar;
      setTimeout(function() {
        bbar.show();
      }, 400);
    };

    /**
     * Transition in
     * @method transitionIn
     */
    GameScreen.prototype.transitionIn = function() {

      this.el.style.display = 'block';
    };

    /**
     * Transition out
     * @method transitionOut
     */
    GameScreen.prototype.transitionOut = function() {

    };

    /**
     * Get total move count
     * @method getMoveCount
     */
    GameScreen.prototype.getMoveCount = function() {
      return this.header.moveBtn.count;
    };

    /**
     * Get playing time
     * @method getPlayingTime
     */
    GameScreen.prototype.getPlayingTime = function() {
      return this.header.timeBtn.currentTime;
    };

    /**
     * Resizing handler
     * @method resize
     */
    GameScreen.prototype.resize = function(rw, rh) {
      this.game3d.resize(rw, rh);
    };

    /**
     * Start counter
     * @method startCounter
     */
    GameScreen.prototype.startCounter = function() {
      this.header.dbar.start();
    };

    /**
     * Stop counter
     * @method stopCounter
     */
    GameScreen.prototype.stopCounter = function() {
      this.header.dbar.stop();
    };

    /**
     * Dispose resources
     * @method dispose
     */
    GameScreen.prototype.dispose = function() {

    };

    return GameScreen;
  });
