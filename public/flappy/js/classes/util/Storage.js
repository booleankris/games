function Storage(prefix) {
    this.prefix = prefix;
}

Storage.prototype.getItem = function(name, type) {
    var _item = localStorage.getItem(this.prefix + name);
    
    // return false if no item found in local storage
    if (_item === null) return null;
    
    // return item of type
    return this._itemOfType(_item, type);
}

Storage.prototype.setItem = function(name, value, type) {
    if (type === 'boolean') {
        value = (value) ? 1 : 0;
    }
    localStorage.setItem(this.prefix + name, value);
}

// adds a new item to the local storage if there is no item 
// does nothing if there is an item already
Storage.prototype.initItem = function(name, defaultValue, type) {
    var _item = localStorage.getItem(this.prefix + name);
    if (_item === null) {
        this.setItem(name, defaultValue, type);
        _item = defaultValue;
    }
    
    // return item of type
    return this._itemOfType(_item, type);
}

Storage.prototype.removeItem = function(name) {
    localStorage.removeItem(this.prefix + name);
}

Storage.prototype._itemOfType = function(item, type) {
    if (type === 'int') return parseInt(item);
    if (type === 'float') return parseFloat(item);
    if (type === 'boolean') return (parseInt(item)) ? true : false;
    return String(item);
}

