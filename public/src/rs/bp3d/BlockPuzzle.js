
/**
 * @author  raizensoft.com
 */
define([
  'rs/three/BaseApp', 
  'rs/bp3d/Preferences', 
  'rs/bp3d/AssetManager', 
  'rs/bp3d/screen/HomeScreen', 
  'rs/bp3d/screen/GameScreen', 
  'rs/bp3d/screen/LevelScreen', 
  'rs/bp3d/FullscreenButton', 
  'rs/ui/RingPreloader', 
  'rs/utils/ObjectUtil', 
  'rs/utils/MouseUtil',
  'rs/utils/BrowserUtil'],

  function(
    BaseApp, 
    Preferences, 
    AssetManager, 
    HomeScreen, 
    GameScreen, 
    LevelScreen, 
    FullscreenButton, 
    RingPreloader,
    ObjectUtil,
    MouseUtil,
    BrowserUtil) {

    "use strict";

    var RESIZE_TIMEOUT = 200;
    var CONFIG_PATH = "config.json";

    var pf = BrowserUtil.getPrefix();
    var mdown, mup, mmove;

    function BlockPuzzle(input, options) {

      // Load main config.json
      this.loadConfig();

      // Mobile setup
      this.isMobile = BrowserUtil.isMobile();

      if (this.isMobile) {

        mdown = 'touchstart';
        mup = 'touchend';
        mmove = 'touchmove';
      }
      else {
        mdown = 'mousedown';
        mup = 'mouseup';
        mmove = 'mousemove';
      }

      this.mevents =  {
        mdown:mdown,
        mup:mup,
        mmove:mmove,
      };

      // Init default options
      this.defaultOptions = {
        bevelScale:0.96,
        pieceDepth:22,
        pieceSpecular:0x0a0a0a, 
        pieceEmissive: 0x010101,
        pieceColor: 0xffffff,
        boardThickness:1,
        boardDepth:16,
        boardMaxWidth:780,
        boardMaxHeight:780,
        fitFactor:0.95,
        ambientLight:0x555555,
        lightMovingSpeed:3
      };

      options = options || {};
      ObjectUtil.merge(options, this.defaultOptions);

      // Setup root reference
      this.root = input;
      BrowserUtil.css(this.root,{
        position:'relative',
        display:'block',
        overflow:'hidden'
      });

      // Setup gallery resize handler
      var bp3d = this;
      window.addEventListener('resize', function(e) {
        bp3d.resize();
      });

      // Set up background music on mobile devices
      document.body.addEventListener('click', function(e) {

        //var bgSound = bp3d.assetManager.bgSound;
        //bgSound.context.resume();
        //if (bgSound && !bgSound.isPlaying) {
          //bgSound.play();
        //}
      });
    }

    /**
     * Load configurations
     * @method loadConfig
     */
    BlockPuzzle.prototype.loadConfig = function() {

      // Load main config.json
      var bp3d = this;
      var req = new XMLHttpRequest();
      req.addEventListener("load", function(e) {

        var result = JSON.parse(this.response);
        bp3d.config = result;
        bp3d.initComponents();
      });
      req.open("GET", CONFIG_PATH);
      req.send();
    };

    /**
     * Init compponents
     * @method initComponent
     */
    BlockPuzzle.prototype.initComponents = function() {

      var bp3d = this;
      var dopt = this.defaultOptions;
      var config = this.config;

      // Preferences
      this.initPreferences();
      
      // Preloader
      this.initPreloader();

      // Default screen
      this.activeScreen = null;

      // Asset managers
      this.assetManager = new AssetManager(this);

      // Home Screen as default screen
      this.setHomeScreen();

      //this.assetManager.onLoad = function() {
        //bp3d.setGameScreen();
      //};
      //this.assetManager.load();

      // Force resize on intialization
      setTimeout(function() {
        bp3d.resize();
      }, RESIZE_TIMEOUT);
    };

    /**
     * Initialize preferences
     * @method initPreferences
     */
    BlockPuzzle.prototype.initPreferences = function() {
      this.pref = new Preferences(this.config, localStorage.getItem("bp3d"));
    };

    /**
     * Init preloader component
     * @method initPreloader
     */
    BlockPuzzle.prototype.initPreloader = function() {

      var rp = new RingPreloader({borderColor:'#ccc'});
      var el = rp.el;
      this.preloader = el;
      el.style.top = '50%';
    };

    /**
     * Show preloader
     * @method showPreloader
     */
    BlockPuzzle.prototype.showPreloader = function() {
      this.root.appendChild(this.preloader);
    };

    /**
     * Hide preloader
     * @method hidePreloader
     */
    BlockPuzzle.prototype.hidePreloader = function() {
      if (this.root.contains(this.preloader))
        this.root.removeChild(this.preloader);
    };

    /**
     * Init fullscreen functionalities
     * @method initFullcreen
     */
    BlockPuzzle.prototype.initFullcreen = function() {

      // Fullscreen button
      var bp3d = this;
      this.fsbtn = new FullscreenButton(this.root, function(e) {
        console.log('fullsceen change');
      });
      this.root.appendChild(this.fsbtn.el);
    };

    /**
     * Shortcut to root element addEventListener method
     * @method addEventListener
     */
    BlockPuzzle.prototype.addEventListener = function(event, listener) {
      this.root.addEventListener(event, listener);
    };

    /**
     * Set active screen
     * @method setScreen
     */
    BlockPuzzle.prototype.setScreen = function(screen) {

      if (this.activeScreen) {
        this.activeScreen.hide();
      };
      screen.show();
      this.activeScreen = screen;
    };

    /**
     * Set active game screen
     * @method setGameScreen
     */
    BlockPuzzle.prototype.setGameScreen = function() {

      if (!this.gameScreen) {
        this.gameScreen = new GameScreen(this);
      }
      this.setScreen(this.gameScreen);
    };

    /**
     * Set home screen as active screen
     * @method setHomeScreen
     */
    BlockPuzzle.prototype.setHomeScreen = function() {

      if (!this.homeScreen)
        this.homeScreen = new HomeScreen(this);
      this.setScreen(this.homeScreen);
    };

    /**
     * Dispose resources
     * @method dispose
     */
    BlockPuzzle.prototype.dispose = function() {

    };

    /**
     * Resize handler
     * @method resize
     */
    BlockPuzzle.prototype.resize = function() {

      var d = this.getAppDimension();
      var rw = d[0], rh = d[1];
      if (this.activeScreen)
        this.activeScreen.resize(rw, rh);
    };

    /**
     * Return current app dimension
     * @method getAppDimension
     */
    BlockPuzzle.prototype.getAppDimension = function() {

      var cs = BrowserUtil.computeStyle;
      var bo = cs(this.root, 'borderTopWidth');
      var rw = cs(this.root, 'width') - 2 * bo;
      var rh = cs(this.root, 'height') - 2 * bo;
      return [rw, rh];
    };

    return BlockPuzzle;

  });
