
/**
 * @author  raizensoft.com
 */
define([
  'rs/three/BaseApp',
  'rs/utils/ObjectUtil', 
  'rs/utils/BrowserUtil', 
  'rs/game3d/Firework3DSet', 
  'rs/bp3d/GameLight', 
  'rs/bp3d/Game3dContainer'], 

  function(
    BaseApp,
    ObjectUtil,
    BrowserUtil,
    Firework3DSet,
    GameLight,
    Game3dContainer) {

    "use strict";

    Game3d.prototype = Object.create(BaseApp.prototype);
    Game3d.prototype.constructor = Game3d;

    var Game3dState = {
      RUNNING:0,
      WON:1,
      LOSE:2
    };

    /**
     * Main game components
     * @class Game3d
     * @constructor
     */
    function Game3d(gs) {

      this.gs = gs;
      this.config = gs.config;
      this.bp3d = gs.bp3d;
      this.dopt = this.bp3d.defaultOptions;
      this.am = this.bp3d.assetManager;

      // Default temporary dimension
      var w = 500, h = 300; 
      BaseApp.prototype.constructor.call(this, w, h);
      this.setCameraMatchProjection();

      // Default cursor
      this.defaultCursor = 'auto';

      // Build basic threejs components
      this.buildScene();
      //this.enableOrbitControl();
    }

    /**
     * Enable orbit controls
     * @method enableOrbitControl
     */
    Game3d.prototype.enableOrbitControl = function() {

      this.controls = new OrbitControls( this.camera, this.el );
      this.controls.enableDamping = true;
    };

    /**
     * Build scene
     * @method buildScene
     */
    Game3d.prototype.buildScene = function() {

      // Parent container for all items
      this.container = new Game3dContainer(this);

      this.clock = new THREE.Clock();

      // Add game container
      var scene = this.scene;
      scene.add(this.container);

      var am = this.am;

      // Init firework collection
      this.f3ds = new Firework3DSet(this, 
        {
          numParticles:3, 
          callback:function() {
            am.firework.play();
          }
        });
      scene.add(this.f3ds);
      //scene.background = new THREE.Color( "" );

      // Intial game state
      this.setRunningState();

      // Setup raycasting
      this._setUpRaycaster();

      // Force resizing upon building scene
      this.resizeHandler();
    };

    /**
     * Setup raycasting
     * @method _setUpRaycaster
     * @private
     */
    Game3d.prototype._setUpRaycaster = function() {

      var camera = this.camera;
      var raycaster = this.raycaster;
      var container = this.container;
      var el = this.el;

      var g3d = this;
      var am = this.am;
      var pb = this.container.puzzleBoard;
      var lastX, lastY;
      var me = BrowserUtil.getMouseTouchEvents();

      function doRaycast (e) {

        var oX, oY;
        if (e.touches) {
          oX = e.touches[0].clientX; oY = e.touches[0].clientY;
        }
        else
        if (e.changedTouches) {
          oX = e.changedTouches[0].clientX; oY = e.changedTouches[0].clientY;
        }
        else {
          oX = e.offsetX; oY = e.offsetY;
        }
        var mouse = {
          x: (oX / g3d.width) * 2 - 1,
          y: -(oY / g3d.height) * 2 + 1,
        };
        raycaster.setFromCamera( mouse, camera );    

        // Compute intersections
        var intersects = raycaster.intersectObjects( container.children, true);

        for ( var i = 0; i < intersects.length; i++ ) {

          var item = intersects[i].object;

          // Click handler
          if (e.type == me.mdown) {

            // Attempt to move piece
            if (item.index !== undefined && item.index !== -1 && g3d.isRunningState()) {

              pb.downItem = item;
              pb.unHighLightCell();
              item.saveLastPosition();
              lastX = oX;
              lastY = oY;
            }
          }

          // Mouse over out handler 
          if (e.type == me.mmove) {
            if (item.index !== undefined) 
              el.style.cursor = 'grab';
            else
              el.style.cursor = g3d.defaultCursor;

            if (pb.downItem) {

              var dX = oX - lastX, dY = -oY + lastY;
              pb.downItem.rmove(dX, dY);

              if (intersects[i + 1]) {
                var inter = intersects[i + 1];
                if (inter.object.isGrayscale) {
                  pb.detectCell(inter.point.x, inter.point.y);
                }
              }
              else {
                pb.unHighLightCell();
              }
            }
          }
          break;

          /*
          - object : intersected object (THREE.Mesh)
          - distance : distance from camera to intersection (number)
          - face : intersected face (THREE.Face3)
          - faceIndex : intersected face index (number)
          - point : intersection point (THREE.Vector3)
          - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          */
        }

        // Mouseout
        if (intersects.length == 0 && e.type == me.mmove) {
          el.style.cursor = g3d.defaultCursor;
        }
      }

      function mouseUpHandler (e) {
        
        if (pb.downItem == null) return;
        if (pb.icell == -1) {
          pb.releaseItem(pb.downItem);
        }
        else {
          pb.attachItem(pb.downItem);
        }
        pb.downItem = null;

        // Check won conditition
        if (g3d.state == Game3dState.RUNNING && pb.isWon()) {
          pb.completeBoard();
          g3d.setWonState();
        }
      }

      // Mouse click, over, out
      el.addEventListener(me.mdown, doRaycast);

      // Check mousemove to determine over and out status
      el.addEventListener(me.mmove, doRaycast);

      // Check mousemove to determine over and out status
      el.addEventListener(me.mup, mouseUpHandler);
    };

    /**
     * Load level
     * @method loadLevel
     */
    Game3d.prototype.loadLevel = function(index, callback) {

      this.setRunningState();

      var catData = this.gs.levels[this.gs.currentCategory];

      // Back to level 0
      if (index == catData.content.length)
        index = 0;

      var item = catData.content[index];
      var a = item.board.split("x");
      var r = Number.parseInt(a[0]), c = Number.parseInt(a[1]);
      var g3d = this;
      this.container.visible = false;

      // Set duration
      this.gs.header.dbar.setDuration(item.duration);

      if (true) {
        this.container.puzzleBoard.applyImage(item.path, r, c, function() {

          g3d.container.show();

          // Apply transition in
          callback.call(g3d);
        });
      }
    };

    /**
     * Override _renderRequest
     * @method _renderRequest
     */
    Game3d.prototype._renderRequest = function() {

      BaseApp.prototype._renderRequest.call(this);
      var delta = this.clock.getDelta();
      if (this.controls)
        this.controls.update();

      this.container.glight.animate();
      if (this.state == Game3dState.WON) {
        this.f3ds.update(delta);
      }
      //this.container.position.z -= 0.01;
      //this.container.rotation.y += 0.01;
    };

    /**
     * Set current state to running
     * @method setRunningState
     */
    Game3d.prototype.setRunningState = function() {

      this.state = Game3dState.RUNNING;
      this.f3ds.visible = false;
      this.gs.header.show();
    };

    /**
     * Test running state
     * @method isRunningState
     */
    Game3d.prototype.isRunningState = function() {
      return (this.state == Game3dState.RUNNING);
    };

    /**
     * Set current state to won
     * @method setWonState
     */
    Game3d.prototype.setWonState = function() {

      if (this.state !== Game3dState.RUNNING) return;

      this.state = Game3dState.WON;

      // Stop counter
      this.gs.stopCounter();

      // Show firework
      this.f3ds.visible = true;
      this.f3ds.reset();

      // Setup UI
      this.gs.header.timeBtn.pause();
      this.gs.header.hide();
      this.gs.showWonBar();
      this.am.wintune.play();

      // Unlock next level
      this.gs.unlockNextLevel();
    };

    /**
     * Set lose state
     * @method setWonState
     */
    Game3d.prototype.setLoseState = function() {

      if (this.state !== Game3dState.RUNNING) return;

      this.state = Game3dState.LOSE;

      this.container.setLoseState();

      // Setup UI
      this.gs.header.timeBtn.pause();
      this.gs.header.hide();
      this.gs.showLoseBar();
      this.am.losetune.play();
    };


    /**
     * Resize game
     * @method resize
     */
    Game3d.prototype.resize = function(rw, rh) {

      this.width = rw;
      this.height = rh;
      this.camera.aspect = rw / rh;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(rw, rh);
      this.resizeHandler();
      this.container.fitPuzzleBoard();
      this.f3ds.changeRegion(rw, rh);
    };

    /**
     * Override resizeHandler
     * @method resizeHandler
     */
    Game3d.prototype.resizeHandler = function(e) {

      BaseApp.prototype.resizeHandler.call(this);
      this.setCameraMatchProjection();
    };

    /**
     * Show this element
     * @method show
     */
    Game3d.prototype.show = function() {
      this.el.style.display = 'block';
    };

    /**
     * Hide this element
     * @method hide
     */
    Game3d.prototype.hide = function() {
      this.el.style.display = 'none';
    };

    /**
     * Shuffle current puzzle board
     * @method shuffle
     */
    Game3d.prototype.shuffle = function() {

      if (!this.isRunningState()) return;
      if (this.container.isShuffling) return;
      this.container.shuffle();

      // Reset timer and count move
      this.gs.reset();
    };

    /**
     * Destroy the game component and save resoureces
     * @method destroy
     */
    Game3d.prototype.destroy = function() {

    };

    return Game3d;

  });
