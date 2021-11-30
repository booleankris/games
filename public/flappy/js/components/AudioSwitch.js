var AudioSwitch = function(options) {
    if (!options) return console.log('type, group, x, y, atlas, spriteOn, spriteOff, sndClick');

    var _type = (options.type) ? options.type : 'sound';
    var _group = (options.group) ? options.group : null;
    var _x = (options.x) ? options.x : 0;
    var _y = (options.y) ? options.y : 0;
    var _atlas = (options.atlas) ? options.atlas : null;
    var _spriteOn = (options.spriteOn) ? options.spriteOn : '';
    var _spriteOff = (options.spriteOff) ? options.spriteOff : '';
    var _sndClick = (options.sndClick) ? options.sndClick : null;

    var _volume = _type === 'sound' ? game.audio.getVolumeSounds() : game.audio.getVolumeMusic();
    var _sprite = _volume === 0 ? _spriteOff : _spriteOn;

    if (_atlas) {
        Phaser.Sprite.call(this, game, _x, _y, _atlas, _sprite);
    } else {
        Phaser.Sprite.call(this, game, _x, _y, _sprite);
    }

    this.anchor.setTo(0.5);
    this.type = _type;
    this.group = _group;
    this.atlas = _atlas;
    this.spriteOn = _spriteOn;
    this.spriteOff = _spriteOff;
    this.sndClick = _sndClick;

    if (_group) {
        _group.add(this);
    } else {
        game.add.existing(this);
    }

    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputDown.add(this.switch, this);
}

AudioSwitch.prototype = Object.create(Phaser.Sprite.prototype);
AudioSwitch.prototype.constructor = AudioSwitch;

AudioSwitch.prototype.switch = function() {
    var _switchMethod = this.type === 'sound' ? game.audio.switchVolumeSounds() : game.audio.switchVolumeMusic();

    var _volume = this.type === 'sound' ? game.audio.getVolumeSounds() : game.audio.getVolumeMusic();
    var _sprite = _volume === 0 ? this.spriteOff : this.spriteOn;    

    if (this.atlas) {
        this.loadTexture(this.atlas, _sprite);
    } else {
        this.loadTexture(_sprite);
    }

    if (this.sndClick) game.audio.playSound('sndClick');
}