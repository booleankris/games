
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    GrayscalePlane.prototype = Object.create(THREE.Group.prototype);
    GrayscalePlane.prototype.constructor = GrayscalePlane; 

    /**
     * 3D plane display grayscale image
     * @class GrayscalePlane
     * @constructor
     */
    function GrayscalePlane(pb) {

      this.pb = pb;
      this.init();
    }

    /**
     * Init
     * @method init
     */
    GrayscalePlane.prototype.init = function() {

      THREE.Group.prototype.constructor.call(this);

      var d = this.pb.dopt;

      // Geometry
      this.mesh = new THREE.Mesh();
      this.add(this.mesh);
      this.mesh.geometry = new THREE.PlaneBufferGeometry(100, 100);

      // Material
      var pmaterial = new THREE.MeshPhongMaterial( { 
        specular:d.pieceSpecular, 
        color: d.pieceColor,
        emissive: d.pieceEmissive,
        side: THREE.FrontSide});
      this.mesh.material = pmaterial;
      this.mesh.isGrayscale = true;

      // Highlight cell
      this.hcell = new THREE.Mesh();
      this.hcell.geometry = new THREE.PlaneBufferGeometry(10, 10);
      this.hcell.material = new THREE.MeshBasicMaterial({color:0xffcc00, opacity:0.5, transparent:true});
      this.add(this.hcell);
      this.hcell.visible = false;
      this.hcell.position.z = 4;
    };

    /**
     * Set grayscale image
     * @method setImage
     */
    GrayscalePlane.prototype.setImage = function(imgCanvas) {

      // Update geometry
      this.mesh.scale.set(imgCanvas.width / 100, imgCanvas.height / 100, 1);

      // Update material
      var ictx = imgCanvas.getContext('2d');
      var idata = ictx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
      var data = idata.data;
      for (var i = 0; i < data.length; i += 4) {
        var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
      }

      // New grayscale canvas
      var ncanvas = document.createElement('canvas');
      ncanvas.width = idata.width;
      ncanvas.height = idata.height;
      var ctx = ncanvas.getContext('2d');
      ctx.putImageData(idata, 0, 0);

      // Draw rectangle grid
      var r = this.pb.row, c = this.pb.column, sw = this.pb.segmentWidth, sh = this.pb.segmentHeight;

      for (var i = 0; i < r; i++) {
        ctx.moveTo(0, i * sh);
        ctx.lineTo(idata.width, i * sh);
      }
      for (var i = 0; i < c; i++) {
        ctx.moveTo(i * sw, 0);
        ctx.lineTo(i * sw, idata.height);
      }
      ctx.lineWidth = '2';
      ctx.strokeStyle = '#111';
      ctx.stroke();

      // Update highlighted cell
      this.hcell.scale.set(sw / 10, sh / 10, 1);

      // New texture
      var newTex = new THREE.CanvasTexture(ncanvas);
      this.mesh.material.map = newTex;
      this.mesh.material.needsUpdate = true;
    };

    /**
     * Hightlight a cell
     * @method highlightCell
     */
    GrayscalePlane.prototype.highlightCell = function(i, j) {

      var iw = this.pb.imageWidth, ih = this.pb.imageHeight;
      var sw = this.pb.segmentWidth, sh = this.pb.segmentHeight;
      var xp = j * sw - iw * 0.5, yp = 0.5 * ih - i * sh;
      this.hcell.position.x = xp + sw * 0.5;
      this.hcell.position.y = yp - sh * 0.5;
      this.hcell.visible = true;
    };

    /**
     * Hide highlight cell
     * @method unHighLightCell
     */
    GrayscalePlane.prototype.unHighLightCell = function() {

      this.hcell.visible = false;
    };

    return GrayscalePlane;

  });
