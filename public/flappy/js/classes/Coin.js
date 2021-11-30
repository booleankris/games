var Coin = function(x, y) {
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'coin_0');
    game.groups.coins.add(this);

    this.animations.add('idle', Phaser.Animation.generateFrameNames('coin_', 0, 9));
    this.animations.play('idle', 10, true);
    //this.tween = game.add.tween(this.scale).to({x: 1.1, y: 1.1}, 300, 'Linear', true, 0, -1, true);

    game.physics.box2d.enable(this);
    this.body.setCircle(24);
    this.body.gravityScale = 0;
    this.body.setCollisionCategory(2);
    this.body.sensor = true;
    this.body.data.m_fixtureList.m_filter.groupIndex = -8;

    this.body.velocity.x = -300;
}

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.update = function() {
    if(this.x < -this.width) {
        this.body.destroy();
        this.destroy();
    }
}