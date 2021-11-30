var GameState = {
    create: function () {
        game.speed = 5;
        game.currentSkin = game.storage.getItem('currentSkin', 'string');

        game.groups = {};
        ['bg', 'obstacles', 'coins', 'gui'].forEach(function(group){
            game.groups[group] = game.add.group();
        });

        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.physics.box2d.debugDraw.joints = true;
        game.physics.box2d.gravity.y = 1000;

        game.groups.bg.create(0, 0, 'atlas', 'game_bg');
        game.ground = new Ground();

        game.bird = new Bird();
        game.spawner = new Spawner();

        //new Pipe(700);

        game.iconCoins = game.add.image(32, 32, 'atlas', 'coin_0');
        game.groups.gui.add(game.iconCoins);

        game.textCoins = game.add.text(95, 31, game.bird.score);
        game.groups.gui.add(game.textCoins);
        game.textCoins.font = 'feast';
        game.textCoins.fontSize = 40;
        game.textCoins.fill = '#fff';
        game.textCoins.stroke = '#000';
        game.textCoins.strokeThickness = 6;

        new AudioSwitch({
            x: game.world.width - 40,
            y: 40,
            type: 'music',
            spriteOff: 'icon_music_off',
            spriteOn: 'icon_music_on',
            atlas: 'atlas',
            group: game.groups.gui
        });   
        
        new AudioSwitch({
            x: game.world.width - 100,
            y: 40,
            type: 'sound',
            spriteOff: 'icon_sound_off',
            spriteOn: 'icon_sound_on',
            atlas: 'atlas',
            group: game.groups.gui
        });
    },

    render: function() {
        //game.debug.box2dWorld();
    },

    update: function() {
        //console.log(game.groups.obstacles.children.length);
    },
};

function spawnPipe() {
    new Pipe(1400);
    game.time.events.add(2000, spawnPipe, this);
}