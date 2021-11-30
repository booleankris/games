var Bird = function() {
    Phaser.Sprite.call(this, game, 200, 300, 'atlas', '');
    game.add.existing(this);

    this.alive = true;
    this.score = 0;
    this.swingVelocity = -450;
    this.ANGLE = 20 * Math.PI / 180;

    this.animations.add('idle', Phaser.Animation.generateFrameNames('birds/' + game.currentSkin + '/bird_', 0, 3));
    this.animations.play('idle', 15, true);


    game.physics.box2d.enable(this);
    this.body.setRectangle(this.width - 20, this.height - 20, 0, -5);
    this.body.setCategoryContactCallback(64, this.crash, this);
    this.body.setCategoryContactCallback(2, this.collect, this);
    //this.body.gravityScale = 0;

    game.input.onDown.add(this.tap, this);
}

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
    this.body.rotation = this.body.velocity.y < 0 ? -this.ANGLE : this.ANGLE;
    if (this.swingVelocity !== 0 && this.y < -50) this.swingVelocity = 0;
}

Bird.prototype.tap = function() {
    if (this.swingVelocity !== 0) {
        this.body.velocity.y = this.swingVelocity;
        game.audio.playSound('sndWings');
    }
}

Bird.prototype.crash = function(body1, body2, fixture1, fixture2, begin) {
    if (!begin || !this.alive) return;

    this.alive = false;
    game.spawner.active = false;
    this.body.destroy();
    this.destroy();

    game.audio.playSound('sndBam');
    new GameOver(this.score);
}

Bird.prototype.collect = function(body1, body2, fixture1, fixture2, begin) {
    if (!begin) return;
    if (body2.sprite) body2.sprite.destroy();
    body2.destroy();
    this.score += 1;
    game.textCoins.text = this.score;
    game.audio.playSound('sndCoin');
}