
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * Preferences
     * @class Preferences
     * @constructor
     */
    function Preferences(config, dataString) {

      this.dataString = dataString;
      this.config = config;
      this.init(dataString);
    }

    /**
     * Init preferences
     * @method init
     */
    Preferences.prototype.init = function(dataString) {

      if (dataString == null) {
        this.data = {
          name:'bp3d',
          unlocked:{
          }
        };
        var lvl = this.config.data.level;
        for (var k in lvl) {
          this.data.unlocked[k] = [1];
        }
        this.save();
      }
      else {
        this.data = JSON.parse(dataString);
      }
    };

    /**
     * Save new data to local storage
     * @method save
     */
    Preferences.prototype.save = function() {
      if (this.data != null)
        localStorage.setItem("bp3d", JSON.stringify(this.data));
    };

    /**
     * Return unlocked status
     * @method isUnlocked
     */
    Preferences.prototype.isUnlocked = function(catId, index) {

      if (index == 0) return true;
      var cat = this.getUnlockCategory(catId);
      if (cat == null)
        return false;
      if (cat[index] !== 1) return false;
      return true;
    };

    /**
     * Save unlock id to local storage
     * @method saveUnlock
     */
    Preferences.prototype.saveUnlock = function(catId, index) {

      var ul = this.data.unlocked;
      if (ul[catId] == undefined) {
        ul[catId] = [];
      }
      ul[catId][index] = 1;
      this.save();
    };

    /**
     * Save difficulty
     * @method saveDifficulty
     */
    Preferences.prototype.saveDifficulty = function(value) {

      this.data.difficulty = value;
      this.save();
    };

    /**
     * Save default category
     * @method saveDefaultCategory
     */
    Preferences.prototype.saveDefaultCategory = function(value) {

      this.data.defaultCategory = value;
      this.save();
    };

    /**
     * Return the content of unlock category
     * @method getUnlockCategory
     */
    Preferences.prototype.getUnlockCategory = function(id) {

      var ul = this.data.unlocked;
      for (var k in ul) {
        if (k == id) {
          return ul[k];
        }
      }
      return null;
    };


    return Preferences;

  });
