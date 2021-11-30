
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    var SOUNDS_PATH = 'assets/sounds';
    var GRAPHICS_PATH = 'assets/graphics';

    /**
     * Central asset manager objec
     * @class AssetManager
     * @constructor
     */
    function AssetManager(bp3d) {

      this.bp3d = bp3d;
      this.init();
    }

    /**
     * Init sub components
     * @method init
     */
    AssetManager.prototype.init = function() {

      // Init LoadingManager
      var lm = this.loadingManager = new THREE.LoadingManager();
      var am = this;
      lm.onLoad = function() {

        am.loaded = true;
        console.log('Assets loaded');
        if (am.onLoad)
          am.onLoad.call(am);
      };
      lm.onProgress = function(url, loaded, total) {
        if (am.onProgress)
          am.onProgress.call(am, url, loaded, total);
      };
      this.soundOn = true;
    };

    /**
     * Start loading assets
     * @method load
     */
    AssetManager.prototype.load = function() {

      this.loadPatterns();
      this.loadAudio();
      this.loadTextures();
    };

    /**
     * Load image pattern
     * @method loadPatterns
     */
    AssetManager.prototype.loadPatterns = function() {

      var d = this.bp3d.defaultOptions;
      var c = this.bp3d.config;
      var pp = c.general.paddingPatterns;

      this.padSet = [];
      for (var i = 0; i < pp.length; i++) {

        var paddingPattern = document.createElement('img');
        paddingPattern.class = 'paddingPattern';
        paddingPattern.src = GRAPHICS_PATH + "/" + pp[i];
        paddingPattern.style.display = 'none';
        document.body.appendChild(paddingPattern);
        this.padSet.push(paddingPattern);
      }
    };

    /**
     * Load audio facility
     * @method loadAudio
     */
    AssetManager.prototype.loadAudio = function() {

      var am = this;

      // Audio 
      var listener = new THREE.AudioListener();
      //camera.add( listener );

      function loadAudio (src, callback) {

        var au = new THREE.Audio(listener);
        var audioLoader = new THREE.AudioLoader(am.loadingManager);
        audioLoader.load(src, function(buffer) {
          au.setBuffer(buffer);
          if (callback)
            callback.call(am);
        });
        return au;
      }

      // Background
      if (this.bp3d.config.general.useBackgroundMusic)
        this.bgSound = loadAudio(SOUNDS_PATH + '/bg.mp3', function() {
          this.bgSound.setLoop(true);
        });

      // btnClick sound
      this.piecemove = loadAudio(SOUNDS_PATH + '/piecemove.mp3');

      // Piece moving
      this.btnClick = loadAudio(SOUNDS_PATH + '/btnClick.mp3');

      // Shuffle sound
      this.shufflestart = loadAudio(SOUNDS_PATH + '/shufflestart.mp3');
      this.shuffleend = loadAudio(SOUNDS_PATH + '/shuffleend.mp3');

      // Firework
      this.firework = loadAudio(SOUNDS_PATH + '/firework.mp3');

      // Win tune
      this.wintune = loadAudio(SOUNDS_PATH + '/wintune.mp3');

      // Lose tune
      this.losetune = loadAudio(SOUNDS_PATH + '/losetune.mp3');
    };

    /**
     * Load app textures
     * @method loadTextures
     */
    AssetManager.prototype.loadTextures = function() {

      var d = this.bp3d.defaultOptions;
      var am = this;

      // Board textures
      var texList = this.bp3d.config.general.boardTextures;
      this.boardTextures = [];

      function loadBoardTexture (path) {
        
        var boardLoader = new THREE.TextureLoader(am.loadingManager);
        boardLoader.load(GRAPHICS_PATH + '/' + path, function(tex) {
          am.boardTextures.push(tex);
        });
      }

      for (var i = 0; i < texList.length; i++) {
        loadBoardTexture(texList[i]);
      }
      
      // Firework texture
      var fwl = new THREE.TextureLoader(am.loadingManager);
      fwl.load(GRAPHICS_PATH + '/' + 'lensflare.png', function(tex) {
        am.fwTexture = tex;
      });
    };

    /**
     * Toggle sound
     * @method toggleSound
     */
    AssetManager.prototype.toggleSound = function() {

      this.soundOn = !this.soundOn;

      if (this.soundOn) {

        this.bgSound.setVolume(0.8);
        this.piecemove.setVolume(1);
        this.btnClick.setVolume(1);
        this.shufflestart.setVolume(1);
        this.shuffleend.setVolume(1);
        this.firework.setVolume(1);
        this.wintune.setVolume(1);
      }
      else {
        this.bgSound.setVolume(0);
        this.piecemove.setVolume(0);
        this.btnClick.setVolume(0);
        this.shufflestart.setVolume(0);
        this.shuffleend.setVolume(0);
        this.firework.setVolume(0);
        this.wintune.setVolume(0);
      }
    };

    return AssetManager;

  });
