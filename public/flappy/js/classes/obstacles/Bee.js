var Bee = function(x, y) {
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'bee_0');
    game.groups.obstacles.add(this)

    game.physics.box2d.enable(this);
    this.body.setCircle(30);
    this.body.kinematic = true;
    this.body.setCollisionCategory(64);
    this.body.sensor = true;

    this.animations.add('idle', Phaser.Animation.generateFrameNames('bee_', 0, 16));
    this.animations.play('idle', 20, true);
    
    this.body.data.m_fixtureList.m_filter.groupIndex = -8;
    this.body.velocity.x = -game.speed * 60 * 1.5;
}

Bee.prototype = Object.create(Phaser.Sprite.prototype);
Bee.prototype.constructor = Bee;

Bee.prototype.update = function() {
    if (this.x < -this.width) {
        this.body.destroy();
        this.destroy();
    }
}

