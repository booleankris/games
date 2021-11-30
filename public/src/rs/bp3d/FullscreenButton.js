
/**
 * @author  raizensoft.com
 */
define([
  'rs/utils/BrowserUtil',
  'rs/utils/MouseUtil'
],
  function(BrowserUtil, MouseUtil) {
  
    "use strict";

    /**
     * FullscreenButton
     * @class FullscreenButton
     * @constructor
     */
    function FullscreenButton(targetEl, callback) {

      this.targetEl = targetEl;
      this.build('icon-screen-full', callback);
    }

    /**
     * Build the component
     * @method build
     * @private
     */
    FullscreenButton.prototype.build = function(className, callback) {

      var fsbtn = this;
      var targetEl = this.targetEl;
      var el = this.el = document.createElement('span');
      el.className = className + ' rs-bp3d-fsbtn';

      MouseUtil.touchClick(el, function(e) {
        if (BrowserUtil.isFullscreen()) 
          BrowserUtil.exitFullscreen(targetEl);
        else
          BrowserUtil.goFullscreen(targetEl);
      });

      BrowserUtil.fullScreenCallback(targetEl, function() {
      
        if (BrowserUtil.isFullscreen()) 
          fsbtn.setFull();
        else
          fsbtn.setNormal();
        callback.call(targetEl);
      });
    };

    /**
     * Set full appearance
     * @method setFull
     */
    FullscreenButton.prototype.setFull = function() {

      //BrowserUtil.goFullscreen(this.targetEl);
      this.el.classList.remove('icon-screen-full');
      this.el.classList.add('icon-screen-normal');
    };

    /**
     * Set normal appearance
     * @method setNormal
     */
    FullscreenButton.prototype.setNormal = function() {

      //BrowserUtil.exitFullscreen(this.targetEl);
      this.el.classList.remove('icon-screen-normal');
      this.el.classList.add('icon-screen-full');
    };

    return FullscreenButton;

  });
