
/**
 * @author  raizensoft.com
 */
define([
  'rs/bp3d/GrayscalePlane',
  'rs/bp3d/PuzzlePiece',
  'rs/bp3d/PuzzlePiecePool'],
  function(
    GrayscalePlane,
    PuzzlePiece, 
    PuzzlePiecePool) {

    "use strict";

    PuzzleBoard.prototype = Object.create(THREE.Group.prototype);
    PuzzleBoard.prototype.constructor = PuzzleBoard; 

    /**
     * PuzzleBoard class
     * @class PuzzleBoard
     * @constructor
     */
    function PuzzleBoard(g3d) {

      this.g3d = g3d;
      this.dopt = g3d.dopt;
      this.init();
    }

    /**
     * Build puzzle board
     * @method init
     */
    PuzzleBoard.prototype.init = function() {

      THREE.Group.prototype.constructor.call(this);

      var d = this.dopt;
      var am = this.g3d.bp3d.assetManager;
      var pb = this;

      // Default pieces collection
      this.pool = new PuzzlePiecePool(this);
      this.pieces = [];

      // Make board components
      function makeBoardComponent() {
        
        var geo = new THREE.BoxBufferGeometry(10, 10, 10);
        var mat = new THREE.MeshPhongMaterial({
          specular:d.pieceSpecular, 
          color: d.pieceColor,
          emissive: d.pieceEmissive,
          side: THREE.FrontSide});
        var bp = new THREE.Mesh(geo, mat);
        pb.add(bp);
        return bp;
      }

      // Board components
      this.topBoard = makeBoardComponent();
      this.leftBoard = makeBoardComponent();
      this.rightBoard = makeBoardComponent();
      this.bottomBoard = makeBoardComponent();
      this.backBoard = makeBoardComponent();

      // Grayscale plane
      this.gsPlane = new GrayscalePlane(this);
      this.add(this.gsPlane);
      this.visible = false;
    };

    /**
     * Apply board pieces with new image 
     * @method updatePieces
     */
    PuzzleBoard.prototype.applyImage = function(src, r, c, callback) {

      var loader = new THREE.TextureLoader();

      var pb = this;
      var pool = this.pool;
      this.row = r; this.column = c;

      loader.load(src, function(tex) {

        var pieces = pb.pieces;
        var iw = tex.image.width, ih = tex.image.height;
        var sw = iw / c, sh = ih / r;

        var fw, fh;
        if (sw > sh) {
          fw = sw * c;
          fh = sw * r;
          sh = sw;
        }
        else {
          fh = sh * r;
          fw = sh * c;
          sw = sh;
        }

        pb.imageWidth = fw;
        pb.imageHeight = fh;
        pb.segmentWidth = sw;
        pb.segmentHeight = sh;

        var imgCanvas = pb.prepareImage(tex.image, fw, fh);
        var newTex = new THREE.CanvasTexture(imgCanvas);
        pb.gsPlane.setImage(imgCanvas);

        var num = r * c;
        for (var i = 0; i < num; i++) {

          var p;
          if (!pieces[i]) {
            p = pool.obtain();
            pieces.push(p);
            pb.add(p);
          }
          else {
            p = pieces[i];
          }
          p.bevelScale = pb.dopt.bevelScale;
          p.updateTexturePosition(i, r, c, newTex);
        }

        for (var i = num; i < pieces.length; i++) {
          var p = pieces[i];
          pb.remove(p);
          pool.free(p);
        }
        pieces.splice(num);
        pb.arrangePieces();
        pb.arrangeBoard();
        pb.visible = true;

        // Pick random board texture
        var am = pb.g3d.bp3d.assetManager;
        var boardTexture = am.boardTextures[Math.floor(Math.random() * am.boardTextures.length)];
        pb.updateBoardTexture(boardTexture);

        // Update grayscale plane
        pb.unHighLightCell();

        if (callback)
          callback.call(pb.g3d);
      });
    };

    /**
     * Return a padding pattern
     * @method getPaddingPattern
     */
    PuzzleBoard.prototype.getPaddingPattern = function() {

      var pads = this.g3d.bp3d.assetManager.padSet;
      var pattern = pads[Math.floor(Math.random() * pads.length)];
      return pattern;
    };

    /**
     * Arrange pieces based on current matrix
     * @method arrangePieces
     */
    PuzzleBoard.prototype.arrangePieces = function() {
      
      this.parray = [];
      this.moveStack = [];
      for (var i = 0; i < this.pieces.length; i++) {

        var p = this.pieces[i];
        var i1 = Math.floor(i / this.column), j1 = i % this.column;
        var pos = this.calPosition(i1, j1);
        p.position.set(pos[0], pos[1], 0);
        p.visible = true;

        // Matrix parameters
        p.pindex = i;
        p.tindex = -1;
        this.parray.push(i);
      }
      this.downItem = null;
      this.icell = this.jcell = -1;
      this.tracking = [];
    };

    /**
     * Calcualte piece position based on i, j
     * @method calPosition
     */
    PuzzleBoard.prototype.calPosition = function(i, j, padding) {

      var w = this.imageWidth, h = this.imageHeight;
      if (padding == undefined) padding = 0;
      var distance = (w / this.column) + padding;
      var w1 = w - distance, h1 = h - distance;
      var ox = -w1 * 0.5, oy = h1 * 0.5;

      function matchZero (nu) {
        if (Math.abs(nu) < 0.0001)
          return 0;
        else
          return nu;
      }

      var tX = ox + j * distance, tY = oy - i * distance;
      tX = matchZero(tX);
      tY = matchZero(tY);
      return [tX, tY];
    };

    /**
     * Update board texture 
     * @method updateBoardTexture
     */
    PuzzleBoard.prototype.updateBoardTexture = function(tex) {

      this.topBoard.material.map = tex;
      this.topBoard.material.needsUpdate = true;

      this.bottomBoard.material.map = tex;
      this.bottomBoard.material.needsUpdate = true;

      this.leftBoard.material.map = tex;
      this.leftBoard.material.needsUpdate = true;

      this.rightBoard.material.map = tex;
      this.rightBoard.material.needsUpdate = true;

      this.backBoard.material.map = tex;
      this.backBoard.material.needsUpdate = true;
    };

    /**
     * Prepare image asset
     * @method prepareImage
     */
    PuzzleBoard.prototype.prepareImage = function(img, fw, fh) {

      var d = this.dopt;

      // Image pattern
      var paddingPattern = this.getPaddingPattern();
      var imgCanvas = document.createElement('canvas');
      imgCanvas.width = fw;
      imgCanvas.height = fh;

      var ictx = imgCanvas.getContext('2d');
          
      var r = img.width / img.height;

      if (fw / r > fh) {

        img.height = fh;
        img.width = fh * r;
      }
      else {
        img.width = fw;
        img.height = fw / r;
      }

      var sx = (fw - img.width) * 0.5;
      var sy = (fh - img.height) * 0.5;

      var pat = ictx.createPattern(paddingPattern, "repeat");
      ictx.fillStyle = pat;
      ictx.fillRect(0, 0, fw, fh);
      ictx.drawImage(img, sx, sy, img.width, img.height);
      return imgCanvas;
    };

    /**
     * Arrange board piece
     * @method arrangeBoard
     */
    PuzzleBoard.prototype.arrangeBoard = function() {

      var d = this.dopt;
      var boardThickness = d.boardThickness, boardDepth = d.boardDepth;
      var w = this.imageWidth, h = this.imageHeight;
      var fw = w + 2 * boardThickness, fh = boardThickness, fd = d.pieceDepth + boardDepth;

      // Top board
      this.topBoard.scale.set(fw / 10, fh / 10, fd / 10);
      this.topBoard.position.set(0, h * 0.5 + 0.5 * boardThickness, -boardDepth * 0.5);

      // Bottom board
      this.bottomBoard.scale.set(fw / 10, fh / 10, fd / 10);
      this.bottomBoard.position.set(0, -h * 0.5 - 0.5 * boardThickness, -boardDepth * 0.5);
      
      fw = boardThickness, fh = h;

      // Left board
      this.leftBoard.scale.set(fw / 10, fh / 10, fd / 10);
      this.leftBoard.position.set(-w * 0.5 - 0.5 * boardThickness, 0, -boardDepth * 0.5);

      // Right board
      this.rightBoard.scale.set(fw / 10, fh / 10, fd / 10);
      this.rightBoard.position.set(w * 0.5 + 0.5 * boardThickness, 0, -boardDepth * 0.5);

      // Back board
      this.backBoard.scale.set(w / 10, h / 10, boardDepth / 10);
      this.backBoard.position.set(0, 0, -fd * 0.5);
    };

    /**
     * Scale fit board to specific region
     * @method setScaleFitPosition
     */
    PuzzleBoard.prototype.getScaleFitPosition = function(targetWidth, targetHeight) {
      
      var d = this.dopt;

      // Calculate current board dimensions
      var values = this.getBound();
      var fw = values[0], fh = values[1], depth = values[2];

      var k = d.fitFactor || 0.98;
      var r = fw / fh;

      var rt;
      if (targetWidth / r > targetHeight) {
        rt = targetHeight * k / fh;
      }
      else {
        rt = targetWidth  * k/ fw;
      }
      this.rt = rt;

      var camZ = this.g3d.camera.position.z;
      var zt = camZ - camZ / rt - depth * 0.5;
      return zt;
    };

    /**
     * Return puzzle board bound
     * @method getDimension
     */
    PuzzleBoard.prototype.getBound = function() {

      var d = this.dopt;

      // Calculate current board dimensions
      var w = this.imageWidth, h = this.imageHeight;
      var 
        fw = w + 2 * d.boardThickness + 2 * this.segmentWidth, 
        fh = h + 2 * d.boardThickness + 2 * this.segmentHeight, 
        depth = d.pieceDepth + d.boardDepth;
      return [fw, fh, depth];
    };

    /**
     * Shuffle current block
     * @method shuffleBlock
     */
    PuzzleBoard.prototype.shuffleBlock = function() {

      var r = this.row, c = this.column;
      var posArray = [];

      function shuffleArray(array) {

        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }

      // Construct positional array
      var posa = [];
      var count = 0;
      var bd = this.dopt.boardThickness;

      for (var j1 = -1; j1 < this.column + 1; j1++) 
        posa.push({i:-1, j:j1});
      for (var j1 = -1; j1 < this.column + 1; j1++) 
        posa.push({i:this.row, j:j1});
      for (var i1 = 0; i1 < this.row; i1++) 
        posa.push({i:i1, j:-1});
      for (var i1 = 0; i1 < this.row; i1++) 
        posa.push({i:i1, j:this.column});
      shuffleArray(posa);

      for (var i = 0; i < this.pieces.length; i++) {

        var p = this.pieces[i];

        var i1 = posa[i].i, j1 = posa[i].j;
        var pos = this.calPosition(i1, j1);
        var tX = pos[0], tY = pos[1];
        p.tX = tX;
        p.tY = tY;
        p.tindex = -1;

        anime({
          targets:p.position,
          keyframes:[
            {z:600 * Math.random() + 25},
            {z:0, x:tX, y:tY}
          ],
          easing:'easeOutQuint',
          duration:1200,
          delay:250
        });
      }
    };

    /**
     * Check winning state
     * @method isWon
     */
    PuzzleBoard.prototype.isWon = function() {

      for (var i = 0; i < this.pieces.length; i++) {
        var p = this.pieces[i];
        if (p.pindex !== p.tindex)
          return false;
      }
      return true;
    };

    /**
     * Animate puzzle pieces bevel
     * @method tweenBevel
     */
    PuzzleBoard.prototype.tweenBevel = function(targetBevel) {

      for (var i = 0; i < this.pieces.length; i++) {
        var p = this.pieces[i];
        p.tweenBevel(targetBevel);
      }
    };

    /**
     * Do completed board animation
     * @method complete
     */
    PuzzleBoard.prototype.completeBoard = function() {

      this.tweenBevel(1);
      anime({
        targets:this.rotation,
        y:[0, Math.PI / 6, -Math.PI / 6, 0],
        easing:'easeOutQuad',
        delay:200,
        duration:1000
      });
    };

    /**
     * Detect current active cell
     * @method detectCell
     */
    PuzzleBoard.prototype.detectCell = function(x, y) {

      var rx = x / this.imageWidth + 0.5;
      var ry = 0.5 - y / this.imageHeight;

      var j = Math.floor(rx * this.column), i = Math.floor(ry * this.row);
      this.gsPlane.highlightCell(i, j);
      this.icell = i;
      this.jcell = j;
    };

    /**
     * Disable active cell
     * @method unHighLightCell
     */
    PuzzleBoard.prototype.unHighLightCell = function() {

      this.icell = -1;
      this.jcell = -1;
      this.gsPlane.unHighLightCell();
    };


    /**
     * Attach item to cell
     * @method attachItem
     */
    PuzzleBoard.prototype.attachItem = function(p) {

      var tindex = this.icell * this.column + this.jcell; 
      if (this.tracking.includes(tindex)) {

        this.unHighLightCell();
        this.releaseItem(p);
        return;
      }
      if (p.tindex !== -1) {
        var idx = this.tracking.indexOf(p.tindex);
        if (idx >= 0) 
          this.tracking.splice(idx, 1);
      }
      var pos = this.calPosition(this.icell, this.jcell);
      anime.remove(p.position);
      anime({
        targets:p.position,
        x:pos[0],
        y:pos[1],
        z:0,
        duration:800
      });
      p.tindex = tindex;
      this.tracking.push(tindex);
    };

    /**
     * Release holding item
     * @method releaseItem
     */
    PuzzleBoard.prototype.releaseItem = function(p) {

      if (p.tindex !== -1) {
        var idx = this.tracking.indexOf(p.tindex);
        if (idx >= 0) 
          this.tracking.splice(idx, 1);
      }
      anime.remove(p.position);
      anime({
        targets:p.position,
        x:p.tX,
        y:p.tY,
        z:0,
        duration:800
      });
    };

    return PuzzleBoard;

  });
