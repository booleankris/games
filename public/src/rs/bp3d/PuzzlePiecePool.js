
/**
 * @author  raizensoft.com
 */
define([
  'rs/bp3d/PuzzlePiece'],
  function(PuzzlePiece) {

    "use strict";

    var DEFAULT_ITEMS = 10;

    /**
     * PuzzlePiece pool object
     * @class PuzzlePiecePool
     * @constructor
     */
    function PuzzlePiecePool(pb) {

      this.pb = pb;
      this.init();
    }

    /**
     * Init pool object
     * @method init
     */
    PuzzlePiecePool.prototype.init = function() {

      this.pool = [];
      var pb = this.pb;
      for (var i = 0; i < DEFAULT_ITEMS; i++) {

        var pp = new PuzzlePiece(pb);
        this.pool.push(pp);
      }
    };

    /**
     * Return a new piece
     * @method obtain
     */
    PuzzlePiecePool.prototype.obtain = function() {

      if (this.pool.length > 0) {
        var p = this.pool.pop();
        return p;
      }
      else {
        var p = new PuzzlePiece(this.pb);
        return p;
      }
    };

    /**
     * Free pool object
     * @method free
     */
    PuzzlePiecePool.prototype.free = function(piece) {
      this.pool.push(piece);
    };

    return PuzzlePiecePool;
  });
