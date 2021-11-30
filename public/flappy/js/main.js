var Phaser = Phaser || {};
var gameWidth = 1280;
var gameHeight = 720;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS);
game.settings = {
    'lockOrientation': true, // should we prevent a player from playing using incorrect orientation?
    'displayOrientation': 'landscape', // portrait, landscape
    'storagePrefix': 'mif11_' // prefix for local storage items
}

game.state.add('BootState', BootState);
game.state.add('PreloadState', PreloadState);
game.state.add('MainMenuState', MainMenuState);
game.state.add('GameState', GameState);