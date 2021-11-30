var RotatingSpikes = function(x, y) {
    Phaser.Sprite.call(this, game, x, y, '');
    game.groups.obstacles.add(this);

    game.physics.box2d.enable(this);
    this.body.kinematic = true;
    this.body.setRectangle(28, 28);

    this.spikes = game.add.sprite(this.x, this.y, 'atlas', 'rotating_spikes');
    game.physics.box2d.enable(this.spikes);
    this.spikes.body.setCollisionCategory(64);
    game.groups.obstacles.add(this.spikes);

    this.joint = game.physics.box2d.weldJoint(this, this.spikes, 0, 0, 0, -98);

    this.spikes.body.data.m_fixtureList.m_filter.groupIndex = -8;

    // start motion
    this.body.rotation = irandom(7);
    this.body.velocity.x = -game.speed * 60;
    this.body.angularVelocity = choose(-1, 1);
}

RotatingSpikes.prototype = Object.create(Phaser.Sprite.prototype);
RotatingSpikes.prototype.constructor = RotatingSpikes;

RotatingSpikes.prototype.update = function() {
    if (this.x < -this.spikes.height) this.dispose();
}

RotatingSpikes.prototype.dispose = function() {
    game.physics.box2d.world.DestroyJoint(this.joint);

    this.spikes.body.destroy();
    this.spikes.destroy();

    this.body.destroy();
    this.destroy();
}