var MainMenuState = {
    create: function () {
        game.coins = game.storage.getItem('coins', 'int');
        game.add.image(0, 0, 'atlas', 'game_bg');

        this.title = game.add.image(game.world.centerX, 100, 'menu', 'title');
        this.title.anchor.setTo(0.5);
        this.bird = game.add.sprite(game.world.centerX, 200, 'menu', 'bird_0');
        this.bird.anchor.x = 0.5;
        this.bird.animations.add('idle', Phaser.Animation.generateFrameNames('bird_', 0, 3));
        this.bird.animations.play('idle', 15, true);
        this.bird.t1 = game.add.tween(this.bird).to({x: '-10'}, 3000, 'Linear', true, 0, -1, true);
        this.bird.t2 = game.add.tween(this.bird).to({y: '-10'}, 5000, 'Linear', true, 0, -1, true);

        this.play = game.add.button(game.world.centerX, 600, 'menu', function(){
            game.state.start('GameState');
        }, this, 'button_play', 'button_play');
        this.play.anchor.setTo(0.5);

        this.shop = game.add.button(game.world.width - 100, 600, 'menu', function(){
            this.shop.kill();
            this.prepareShop();
        }, this, 'button_shop', 'button_shop');
        this.shop.anchor.setTo(0.5);
        
        new AudioSwitch({
            x: game.world.width - 40,
            y: 40,
            type: 'music',
            spriteOff: 'icon_music_off',
            spriteOn: 'icon_music_on',
            atlas: 'atlas'
        });   
        
        new AudioSwitch({
            x: game.world.width - 100,
            y: 40,
            type: 'sound',
            spriteOff: 'icon_sound_off',
            spriteOn: 'icon_sound_on',
            atlas: 'atlas'
        });
        
    },

    prepareShop: function() {
        this.bird.t1.stop();
        this.bird.t2.stop();
        game.add.tween(this.title).to({y: -200}, 200, 'Linear', true);
        game.add.tween(this.play).to({y: game.world.height + 200}, 200, 'Linear', true);
        game.add.tween(this.bird).to({x: 2000}, 300, 'Linear', true).onComplete.add(function(){
            this.bird.destroy();
            this.title.destroy();
            this.play.destroy();
            this.showShop();
        }, this);
    },

    showShop: function() {
        var skins = JSON.parse(game.storage.getItem('skins'));

        var coin = game.add.image(280, 50, 'atlas', 'coin_0');
        coin.anchor.setTo(0.5);
        var coins = game.add.text(coin.x + 40, coin.y, game.coins);
        coins.anchor.setTo(0, 0.5);
        coins.font = 'feast';
        coins.fill = '#fff';
        coins.stroke = '#000';
        coins.strokeThickness = 8;
        coins.fontSize = 60;

        for (var i = 0; i < 15; i++) {
            var bg = game.add.image(262 + 68 + (i % 5) * 155, 100 + 48 + Math.floor(i / 5) * 145, 'menu', 'skin_bg');
            bg.anchor.setTo(0.5);
            game.add.image(bg.x, bg.y, 'atlas', 'birds/' + i + '/bird_0').anchor.setTo(0.5);

            if (skins[i].unlocked) {
                var btn = game.add.sprite(bg.x, bg.y + 50, 'menu', 'button_buy_on');
                btn.anchor.setTo(0.5);
                btn.inputEnabled = true;
                btn.input.useHandCursor = true;
                btn.index = i;
                btn.events.onInputDown.add(function(btn){
                    game.skin = btn.index;
                    game.storage.setItem('currentSkin', game.skin);
                    game.state.start('GameState');
                }, this, btn);

                var text = game.add.text(btn.x, btn.y, 'Select');
                text.anchor.setTo(0.5);
                text.align = 'center';
                text.font = 'feast';
                text.fill = '#fff';
                text.stroke = '#d16207';
                text.strokeThickness = 3;
            } else {
                if (skins[i].price > game.coins) {
                    var btn = game.add.sprite(bg.x, bg.y + 50, 'menu', 'button_buy_off');
                    btn.anchor.setTo(0.5);

                    var text = game.add.text(btn.x + 20, btn.y, skins[i].price);
                    text.anchor.setTo(0.5);
                    text.align = 'center';
                    text.font = 'feast';
                    text.fill = '#fff';
                    text.stroke = '#3d3d3d';
                    text.strokeThickness = 3;

                    game.add.image(btn.x - 40, btn.y + 2, 'atlas', 'coin_0').anchor.setTo(0.5);
                } else {
                    var btn = game.add.sprite(bg.x, bg.y + 50, 'menu', 'button_buy_on');
                    btn.anchor.setTo(0.5);
                    btn.inputEnabled = true;
                    btn.input.useHandCursor = true;
                    btn.index = i;
                    btn.events.onInputDown.add(function(btn){
                        game.coins -= skins[btn.index].price;
                        skins[btn.index].unlocked = true;
                        game.skin = btn.index;
                        game.storage.setItem('skins', JSON.stringify(skins));
                        game.storage.setItem('currentSkin', btn.index);
                        game.storage.setItem('coins', game.coins);
                        game.state.start('GameState');
                    }, this, btn);

                    var text = game.add.text(btn.x + 20, btn.y, skins[i].price);
                    text.anchor.setTo(0.5);
                    text.align = 'center';
                    text.font = 'feast';
                    text.fill = '#fff';
                    text.stroke = '#3d3d3d';
                    text.strokeThickness = 3;

                    game.add.image(btn.x - 40, btn.y + 2, 'atlas', 'coin_0').anchor.setTo(0.5);
                }
            }
        }
    }
};