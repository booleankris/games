var Bomb = function(x, y) {
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'bee_0');
    game.groups.obstacles.add(this)

    game.physics.box2d.enable(this);
    this.body.setCircle(30);
    this.body.kinematic = true;
    this.body.setCollisionCategory(64);
    this.body.sensor = true;

    this.animations.add('idle', Phaser.Animation.generateFrameNames('bomb_', 0, 24));
    this.animations.play('idle', 20, true);

    this.body.data.m_fixtureList.m_filter.groupIndex = -8;
    this.body.velocity.x = -game.speed * 60;
}

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function() {
    this.body.velocity.y = Math.sin(this.x / 150) * 100;

    if (this.x < -this.width) {
        this.body.destroy();
        this.destroy();
    }
}

