var Spawner = function() {
    this.active = true;
    this.spawn();
}

Spawner.prototype.spawn = function() {
    if(!this.active) return;

    var type = irandom(4);
    //type = 2;
    if (type === 0) {
        this.spawnTrap();
    } else if (type === 1) {
        this.spawnRotatingSpikes();
    } else if (type === 2) {
        this.spawnPipe();
    } else if (type === 3) {
        this.spawnBomb();
    } else if (type === 4) {
        this.spawnBee();
    }
}

Spawner.prototype.spawnTrap = function() {
    var items = irandom_range(1, 2);
    for (var i = 0; i < items; i++) {
        var trap = new Trap(1400 + i * 800, irandom_range(50, 250));
        this.spawnCoins(trap.x + 300);
    }

    game.time.events.add(3500 * items, this.spawn, this);
}

Spawner.prototype.spawnRotatingSpikes = function() {
    var items = irandom_range(1, 1);
    for (var i = 0; i < items; i++) {
        var spikes = new RotatingSpikes(1400 + i * 800, irandom_range(150, 350));
        this.spawnCoins(spikes.x + 300);
    }

    game.time.events.add(3500 * items, this.spawn, this);
}

Spawner.prototype.spawnPipe = function() {
    var items = irandom_range(1, 1);
    for (var i = 0; i < items; i++) {
        var pipe = new Pipe(1400 + i * 600);
        this.spawnCoins(pipe.x + 264);
    }

    game.time.events.add(3000 * items, this.spawn, this);
}

Spawner.prototype.spawnBomb = function() {
    var items = irandom_range(1, 2);
    for (var i = 0; i < items; i++) {
        new Bomb(1400 + i * 400, irandom_range(100, 400));
    }
    this.spawnCoins(1600);
    game.time.events.add(1600 * items, this.spawn, this);
}

Spawner.prototype.spawnBee = function() {
    var items = irandom_range(1, 2);
    for (var i = 0; i < items; i++) {
        new Bee(1400 + i * 400, irandom_range(100, 400));
    }

    this.spawnCoins(1400);
    game.time.events.add(1300 * items, this.spawn, this);
}

Spawner.prototype.spawnCoins = function(x) {
    var type = irandom(30);
    var yy = irandom_range(100, game.world.height - 279);
    if (type === 0) {
        new Coin(x, yy);
    } else if (type === 1) {
        new Coin(x - 29, yy);
        new Coin(x + 29, yy);
    } else if (type === 2) {
        new Coin(x - 54, yy);
        new Coin(x, yy);
        new Coin(x + 54, yy);
    } else if (type === 3) {
        new Coin(x, yy - 29);
        new Coin(x, yy + 29);
    } else if (type === 4) {
        new Coin(x, yy - 54);
        new Coin(x, yy);
        new Coin(x, yy + 54);
    } else if (type === 5) {
        new Coin(x - 29, yy + 29);
        new Coin(x + 29, yy - 29);
    } else if (type === 6) {
        new Coin(x + 29, yy - 29);
        new Coin(x - 29, yy + 29);
    } else if (type === 7) {
        new Coin(x - 54, yy + 54);
        new Coin(x, yy);
        new Coin(x + 54, yy - 54);
    } else if (type === 8) {
        new Coin(x + 54, yy - 54);
        new Coin(x, yy);
        new Coin(x - 54, yy + 54);
    } else if (type === 9) {
        new Coin(x, yy - 54);
        new Coin(x - 54, yy);
        new Coin(x, yy);
        new Coin(x + 54, yy);
        new Coin(x, yy + 54);
    } else if (type === 10) {
        new Coin(x - 54, yy - 54);
        new Coin(x + 54, yy - 54);
        new Coin(x, yy);
        new Coin(x - 54, yy + 54);
        new Coin(x + 54, yy + 54);
    } 
}