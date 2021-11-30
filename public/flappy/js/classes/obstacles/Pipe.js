var Pipe = function(x) {
    Phaser.Sprite.call(this, game, x, 0, '');
    game.groups.obstacles.add(this);

    this.blocks = [];
    this.bodies = [];
    var bottomBlocksNumber = irandom(7);
    this.generateBlocks(bottomBlocksNumber, 'bottom');
    this.generateBlocks(7 - bottomBlocksNumber);

    this.blocks.forEach(function(block){
        //block.body.velocity.x = -game.speed * 60;
    });
}

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
    this.blocks.forEach(function(block){
        block.x += -game.speed;
    });


    if (this.blocks[0].x < -this.blocks[0].width) {
        this.blocks.forEach(function(block) {
            block.destroy();
        });
        this.bodies.forEach(function(body){
            body.destroy();
        });
        this.destroy();
    }
}

Pipe.prototype.generateBlocks = function(blocksNumber, side) {
    if (side === 'bottom' && blocksNumber === 0) return this.generateCoins(game.world.height - 279);

    var yy = side === 'bottom' ? game.world.height - 178 : (game.world.height - 178) - ((7 - blocksNumber) * 41 + 48) - 180;

    var bottom = game.add.sprite(this.x, yy - 22, 'atlas', 'pipe_bottom');
    game.groups.obstacles.add(bottom);
    this.blocks.push(bottom);

    for (var i = 0; i < blocksNumber; i++) {
        var middle = game.add.sprite(this.x, (bottom.y - 41) - i * 41, 'atlas', 'pipe_middle');
        game.groups.obstacles.add(middle);
        this.blocks.push(middle);
    }

    var top = game.add.sprite(this.x, yy - (48 + (blocksNumber * 41)), 'atlas', 'pipe_top');
    game.groups.obstacles.add(top);
    this.blocks.push(top);

    var height = blocksNumber * 41 + 48;
    var body = new Phaser.Physics.Box2D.Body(game, null, this.x + 64, (bottom.y + 22) - height/2);
    body.kinematic = true;
    body.setRectangle(128, height);
    body.setCollisionCategory(64);
    body.velocity.x = -game.speed * 60;
    body.data.m_fixtureList.m_filter.groupIndex = -8;
    this.bodies.push(body);

    if (side === 'bottom') this.generateCoins(top.y - 100);
}

Pipe.prototype.generateCoins = function(yy) {
    var coins = irandom_range(1, 3);
    var width = 58;
    var xx = this.x - (coins - 1) * 0.5 * width;

    for (var i = 0; i < coins; i++) {
        new Coin(xx + i * width, yy);;
    }
}