var BootState = {
    init: function() {
        // Responsive scaling
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // Center the game
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
    },
    
    preload: function() {
        game.load.atlasJSONHash(
            'preload',
            'flappy/assets/images/preload_atlas.png',
            'flappy/assets/images/preload_atlas.json'           
        );
    },
    
    create: function () {
        game.stage.backgroundColor = '#fff';
        
        // add orientation controller
        if (game.settings.lockOrientation) {
            game.orientation = new Orientation(game.settings.displayOrientation);   
            game.orientation.checkOrientation();
        }        
        
        // add storage controller
        game.storage = new Storage(game.settings.storagePrefix);
        
        // add audio controller
        game.audio = new AudioController();
        
        game.storage.initItem('highscore', 0, 'int');
        game.storage.initItem('coins', 0, 'int');
        game.storage.initItem('currentSkin', 0, 'int');
        if (game.storage.getItem('skins', 'string') === null) initSkinData();

        // start preload state
        game.state.start('PreloadState')
    }
};

function initSkinData() {
    var skins = [];
    for (var i = 0; i < 15; i++) {
        skins.push({unlocked: false, price: i * 100});
    }

    skins[0].unlocked = true;

    game.storage.setItem('skins', JSON.stringify(skins));
}