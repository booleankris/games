var PreloadState = {
    preload: function() {
        // show logo and progress bar
        game.preloadLogo = game.add.image(game.world.width/2, game.world.height/2-100, 'preload', 'logo');
        game.preloadLogo.anchor.setTo(0.5);
        
        game.preloadBar = game.add.sprite(game.world.width/2, game.world.height/2+100, 'preload', 'progress');
        game.preloadBar.x -= game.preloadBar.width/2;
        game.load.setPreloadSprite(game.preloadBar);
        
        // load assets 
        game.load.atlasJSONHash('atlas', 'flappy/assets/images/atlas.png', 'flappy/assets/images/atlas.json');
        game.load.atlasJSONHash('menu', 'flappy/assets/images/menu.png', 'flappy/assets/images/menu.json');

        game.load.audio('sndWings', ['flappy/assets/audio/wings.mp3', 'flappy/assets/audio/wings.ogg']);
        game.load.audio('sndBam', ['flappy/assets/audio/bam.mp3', 'flappy/assets/audio/bam.ogg']);
        game.load.audio('sndCoin', ['flappy/assets/audio/coin.mp3', 'flappy/assets/audio/coin.ogg']);
        game.load.audio('musicOst', ['flappy/assets/audio/ost.mp3', 'flappy/assets/audio/ost.ogg']);
    },
    
    create: function() {
        game.audio.addSound('sndWings');
        game.audio.addSound('sndBam');
        game.audio.addSound('sndCoin');
        game.audio.addMusic('musicOst');
        game.audio.playMusic('musicOst');
        // start game
        game.state.start('MainMenuState');
    }
};