
/**
 * @author  raizensoft.com
 */
define([
  'rs/utils/ImageUtil', 
  'rs/bp3d/PuzzleBoard', 
  'rs/bp3d/GameLight'],

  function(
    ImageUtil,
    PuzzleBoard,
    GameLight) {

    "use strict";

    Game3dContainer.prototype = Object.create(THREE.Group.prototype);
    Game3dContainer.prototype.constructor = Game3dContainer; 

    var EASING = 'easeOutQuint';
    var DURATION = 1200;

    /**
     * Generic and root container for all 3d game items
     * @class Game3dContainer
     * @constructor
     */
    function Game3dContainer(g3d) {

      // References to Gallery3D
      this.g3d = g3d;
      this.init();
    }

    /**
     * Init the container
     * @method init
     */
    Game3dContainer.prototype.init = function() {

      // Call parent constructorP
      THREE.Group.prototype.constructor.call(this);

      //  Add PuzzleBoard component
      this.puzzleBoard = new PuzzleBoard(this.g3d);
      this.add(this.puzzleBoard);
      
      // Light object
      var glight = this.glight = new GameLight(this.g3d);
      this.add(glight);
    };

    /**
     * Fit puzzle board to current screen dimension
     * @method fitPuzzleBoard
     */
    Game3dContainer.prototype.fitPuzzleBoard = function() {

      var gs = this.g3d.gs;
      var d = this.g3d.dopt;
      var s0 = gs.header.getClientSize();
      var s1 = gs.bbar.getClientSize();
      var cH = this.g3d.el.clientHeight;
      var cW = this.g3d.el.clientWidth;
      var mw = cW, mh = cH - s0[1] - s1[1] - 10;

      this.g3d.setCameraMatchProjection();
      var zt = this.puzzleBoard.getScaleFitPosition(mw, mh);
      this.position.z = zt;
      this.glight.setBound(this.puzzleBoard.getBound());
    };

    /**
     * Show puzzle board with transitioning effect
     * @method transitionIn
     */
    Game3dContainer.prototype.show = function() {

      this.visible = false;
      this.fitPuzzleBoard();

      // Save original Z position
      var oZ = this.position.z;

      // Starting position and rotation
      this.rotation.x = -Math.PI / 3;
      var g3c = this;

      this.scale.set(0.01, 0.01, 0.01);
      anime.remove(this.scale);
      anime({
        targets:this.scale,
        x:1,
        y:1,
        z:1,
        easing:'easeOutQuad',
        duration:1200
      });

      anime.remove(this.rotation);
      anime({
        targets:this.rotation,
        x:0,
        easing:'easeOutCubic',
        duration:1500,
        complete:function() {

          // Call shuffle after completed transition
          setTimeout(function() {

            g3c.g3d.shuffle();
            g3c.g3d.gs.startCounter();
          }, 300);
        }
      });

      setTimeout(function() {
        g3c.visible = true;
      }, 140);
    };

    /**
     * Shuffle the puzzle board
     * @method shuffle
     */
    Game3dContainer.prototype.shuffle = function() {

      var oX = this.position.z;
      var tX = this.position.z - 400;

      var am = this.g3d.bp3d.assetManager;
      this.isShuffling = true;
      var g3c = this;

      setTimeout(function() {
        am.shufflestart.play();
      }, 250);

      setTimeout(function() {
        am.shuffleend.play();
      }, 1000);

      anime({
        targets:this.position,
        keyframes:[
          {z:tX, duration:1200},
          {z:oX, delay:100, duration:1000}
        ],
        easing:'easeOutQuint',
        duration:1200,
        complete:function() {
          g3c.isShuffling = false;
        }
      });

      anime({
        targets:this.rotation,
        keyframes:[
          {x:-Math.PI/3, duration:1200},
          {x:0, delay:100, duration:1200}
        ],
        easing:'easeOutQuint'
      });
      this.puzzleBoard.shuffleBlock();
    };

    /**
     * Set losing state
     * @method setLoseState
     */
    Game3dContainer.prototype.setLoseState = function() {

      anime.remove(this.rotation);
      anime({
        targets:this.rotation,
        x:-Math.PI / 3,
        easing:'easeOutQuint',
        duration:800
      });

      var tZ = this.position.z - 400;
      anime.remove(this.position);
      anime({
        targets:this.position,
        z:tZ,
        easing:'easeOutQuint',
        duration:800
      });
    };

    return Game3dContainer;

  });
