var Ground = function() {
    Phaser.TileSprite.call(this, game, 0, game.world.height - 178, 1280, 178, 'atlas', 'ground');
    game.groups.obstacles.add(this);

    this.bbox = new Phaser.Physics.Box2D.Body(game, null, game.world.centerX, game.world.height - 89, 0);
    this.bbox.setRectangle(game.world.width, 178);
    this.bbox.setCollisionCategory(64);
    this.bbox.sensor = true;
}

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
    this.tilePosition.x -= game.speed;
}