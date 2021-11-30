
// Setup baseUrl for source folder and library paths
requirejs.config({
  baseUrl:"../src/",
  paths:{
    libs:"../libs/"
  }
});

require(['rs/bp3d/BlockPuzzle', 'libs/domReady'], 

  function(BlockPuzzle, domReady) {

    "use strict";

    domReady(function() {

      var el = document.querySelector('.rs-bp3d');
      var bp3d = new BlockPuzzle(el);
      window.bp3d = bp3d;
    });
  });
