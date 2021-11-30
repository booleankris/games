var loadScriptsSync = function (scripts) {
    if (scripts.length === 0) return game.state.start('BootState'); ;
    var path = scripts.shift();
    var js = document.createElement('script');
    js.async = true;
    js.onload = function(){
        loadScriptsSync(scripts);
    }
    js.src = path;
    document.head.appendChild(js);
}
var scripts = [
    'flappy/js/util.js',
    'flappy/js/box2d-plugin-full.js',

    'flappy/js/states/BootState.js',
    'flappy/js/states/PreloadState.js',
    'flappy/js/states/MainMenuState.js',
    'flappy/js/states/GameState.js',
    'flappy/js/main.js',

    'flappy/js/classes/util/Orientation.js',
    'flappy/js/classes/util/Storage.js',
    'flappy/js/classes/util/AudioController.js',
    'flappy/js/components/AudioSwitch.js',

    'flappy/js/classes/Bird.js',
    'flappy/js/classes/Coin.js',
    'flappy/js/classes/Spawner.js',
    'flappy/js/classes/GameOver.js',
    'flappy/js/classes/obstacles/Ground.js',
    'flappy/js/classes/obstacles/RotatingSpikes.js',
    'flappy/js/classes/obstacles/Trap.js',
    'flappy/js/classes/obstacles/Pipe.js',
    'flappy/js/classes/obstacles/Bee.js',
    'flappy/js/classes/obstacles/Bomb.js',
];

loadScriptsSync(scripts);