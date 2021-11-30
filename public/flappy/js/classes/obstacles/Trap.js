var Trap = function(x, y) {
    Phaser.Sprite.call(this, game, x, y, '');
    game.groups.obstacles.add(this);

    this.distance = 260;

    this.topPiece = game.add.sprite(this.x, this.y, 'atlas', 'trap_top');
    game.physics.box2d.enable(this.topPiece);
    this.topPiece.body.kinematic = true;
    this.topPiece.body.setCollisionCategory(64);
    game.groups.obstacles.add(this.topPiece);

    this.bottomPiece = game.add.sprite(this.x, this.y + this.distance, 'atlas', 'trap_bottom');
    game.physics.box2d.enable(this.bottomPiece);
    this.bottomPiece.body.kinematic = true;
    this.bottomPiece.body.setCollisionCategory(64);
    game.groups.obstacles.add(this.bottomPiece);

    this.topPiece.body.velocity.x = -game.speed * 60;
    this.bottomPiece.body.velocity.x = -game.speed * 60;

    this.generateCoins();
}

Trap.prototype = Object.create(Phaser.Sprite.prototype);
Trap.prototype.constructor = Trap;

Trap.prototype.update = function() {
    if (this.topPiece.x < -this.topPiece.width) this.dispose();
}

Trap.prototype.dispose = function() {
    this.topPiece.body.destroy();
    this.topPiece.destroy();
    this.bottomPiece.body.destroy();
    this.bottomPiece.destroy();
    this.destroy();
}

Trap.prototype.generateCoins = function() {
    var coins = irandom_range(1, 3);
    var width = 58;
    var xx = this.topPiece.x - (coins - 1) * 0.5 * width;
    var yy = this.topPiece.y + 130;

    for (var i = 0; i < coins; i++) {
        new Coin(xx + i * width, yy);;
    }
}