var GameOver = function(score) {
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.height + 1000, 'atlas', 'game_over_bg');
    game.groups.gui.add(this);
    this.anchor.setTo(0.5);

    game.add.tween(this).to({y: game.world.centerY - 100}, 500, 'Bounce', true).onComplete.add(this.showMenus, this);

    this.hs = game.storage.getItem('highscore', 'int');
    this.hs = Math.max(score, this.hs);
    game.storage.setItem('highscore', this.hs);

    var coins = game.storage.getItem('coins', 'int');
    coins += score;
    game.storage.setItem('coins', coins);

    this.score = score;
}

GameOver.prototype = Object.create(Phaser.Sprite.prototype);
GameOver.prototype.constructor = GameOver;

GameOver.prototype.showMenus = function() {
    var hs = game.add.text(game.world.centerX, game.world.centerY - 107, this.hs);
    hs.align = 'center';
    hs.anchor.setTo(0.5);
    hs.font = 'feast';
    hs.fontSize = 40;
    hs.fill = '#fff';
    hs.stroke = '#0b6fa9';
    hs.strokeThickness = 8;
    game.groups.gui.add(hs);

    var score = game.add.text(game.world.centerX, game.world.centerY + 7, this.score);
    score.align = 'center';
    score.anchor.setTo(0.5);
    score.font = 'feast';
    score.fontSize = 50;
    score.fill = '#fff';
    score.stroke = '#f00';
    score.strokeThickness = 10;
    game.groups.gui.add(score);

    replay = game.add.button(game.world.centerX + 195, game.world.centerY + 15, 'atlas', function(){
        game.state.start('GameState');
    }, this, 'button_replay', 'button_replay');
    replay.anchor.setTo(0.5);
    game.groups.gui.add(replay);

    menu = game.add.button(game.world.centerX - 195, game.world.centerY + 15, 'atlas', function(){
        game.state.start('MainMenuState');
    }, this, 'button_menu', 'button_menu');
    menu.anchor.setTo(0.5);
    game.groups.gui.add(menu);    
}