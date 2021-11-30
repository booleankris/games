
/**
 * @author  raizensoft.com
 */
define(

  function() {

    "use strict";

    Game3dItem.prototype = Object.create(THREE.Mesh.prototype);
    Game3dItem.prototype.constructor = Game3dItem; 

    var FADE_DURATION = 1500;
    var DIM_OPACITY = Game3dItem.DIM_OPACITY = 0.25;

    /**
     * Game3dItem
     * @class Game3dItem
     * @constructor
     */
    function Game3dItem(itemInfo, gal, onLoadCallback) {

      THREE.Mesh.prototype.constructor.call(this);

      // Save item info and variables
      this.gal = gal;
      this.info = itemInfo;
      this.index = itemInfo.index;
      this.onLoadCallback = onLoadCallback;

      // Start building the item
      this.build(itemInfo, gal.dopt);
    }

    /**
     * Start building the item
     * @method build
     */
    Game3dItem.prototype.build = function(itemInfo, opt) {

      var item = this;
      var loader = new THREE.TextureLoader();

      loader.load(

        itemInfo.src, 
        function(texture) {

          var frontMat = new THREE.MeshBasicMaterial({map:texture, transparent:false, side:THREE.FrontSide});

          //texture.minFilter = THREE.LinearFilter;

          // Load back material
          if (opt.backImage) {

            var src = opt.backImage;
            var backLoader = new THREE.TextureLoader();
            backLoader.load(src, function(backTexture) {

              var backMat = new THREE.MeshBasicMaterial({map:backTexture, transparent:false, side:THREE.FrontSide});
              
              var mats;
              mats = [
                backMat,
                backMat,
                backMat,
                backMat,
                frontMat,
                backMat
              ];
              item.material = mats;
            });
          }
          else
            item.material = frontMat;

          item.img = texture.image;

          // Image dimensions and constraints
          var w = texture.image.width;
          var h = texture.image.height;
          var r = (w / h);
          var c = opt.constraint;

          if (r > 1) {
            if (w > c) {
              w = c; h = w /r;
            }
          }
          else {
            if (h > c) {
              h = c; w = h * r;
            }
          }

          item.width = w;
          item.height = h;

          var geo;
          if (opt.boxThickness <= 0)
            geo = new THREE.PlaneBufferGeometry(w, h);
          else
            geo = new THREE.BoxBufferGeometry(w, h, opt.boxThickness); 

          frontMat.clipIntersection = true;
          item.geometry = geo;
          item.onLoadCallback.call(item);
          item.gal.makeReflectionItem(item);
        });
    };

    /**
     * Transition in
     * @method transitionIn
     */
    Game3dItem.prototype.transitionIn = function() {

      var dopt = this.gal.dopt;
      var targetDuration, targetDelay;
      var it = this.group;
      it.visible = false;
      it.scale.set(0.1, 0.1, 0.1);

      var MAX_DELAY = dopt.itemTweenInMaxDelay;
      var numItems = this.gal.getCurrentItems().length;

      // Delay styles
      var factor = dopt.itemTweenInDelayFactor;
      var delay = Math.round(Math.random() * MAX_DELAY);
      factor = 1;
      delay = this.index / numItems * factor * MAX_DELAY;

      var du = dopt.itemTweenInDuration;
      var ease = dopt.itemTweenInEasing;

      targetDuration = 1000;
      targetDelay = delay;
      anime.remove(this.group.scale);
      anime({
        targets:this.group.scale,
        x:1,
        y:1,
        z:1,
        duration:targetDuration,
        delay:targetDelay,
        easing:ease
      });

      setTimeout(function() {
        it.visible = true;
      }, targetDelay);
    };

    /**
     * Transition out
     * @method transitionOut
     */
    Game3dItem.prototype.transitionOut = function(itemCallback) {
      
      var it = this.group;
      var du = this.gal.dopt.itemTweenOutDuration;
      var ease = this.gal.dopt.itemTweenOutEasing;

      anime.remove(this.group.scale);
      anime({
        targets:this.group.scale,
        x:0.01,
        y:0.01,
        z:0.01,
        duration:du,
        easing:ease,
        complete:function() {

          itemCallback.call(it);
          it.visible = false;
        }
      });
    };

    /**
     * Set a click handler
     * @method setClickHandler
     */
    Game3dItem.prototype.setClickHandler = function(handler) {
      this.clickHandler = handler;
    };

    /**
     * Set mouse over handler
     * @method setMouseOverHandler
     */
    Game3dItem.prototype.setMouseOverHandler = function(handler) {
      this.overHandler = handler;
    };

    /**
     * Tint current material
     * @method tint
     */
    Game3dItem.prototype.tint = function(color) {

      if (this.material.length) {

        var l = this.material.length;
        for (var i = 0; i < l; i++) {
          this.material[i].color.set(color);
        }
      }
      else
        this.material.color.set(color);
    };

    /**
     * Tint white
     * @method tintWhite
     */
    Game3dItem.prototype.tintWhite = function() {
      this.tint('#ffffff');
    };

    /**
     * Destroy the item
     * @method destroy
     */
    Game3dItem.prototype.destroy = function() {

      // Dispose geometry and material
      this.geometry.dispose();
      this.material.dispose();
    };

    return Game3dItem;

  });
