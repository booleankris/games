
/**
 * @author  raizensoft.com
 */
define([
  'rs/game/OptionPanel',
  'rs/game/BasePanel'
],
  function(OptionPanel, BasePanel) {

    "use strict";

    SettingPanel.prototype = Object.create(BasePanel.prototype);
    SettingPanel.prototype.constructor = SettingPanel;

    var SETTING_DIFFICULTY = {
      EASY:0,
      NORMAL:1,
      HARD:2
    };

    /**
     * Credit panel component
     * @class SettingPanel
     * @constructor
     */
    function SettingPanel(bp3d) {

      this.bp3d = bp3d;
      this.config = bp3d.config;
      BasePanel.prototype.constructor.call(this);
    }

    /**
     * Init
     * @method init
     */
    SettingPanel.prototype.init = function() {

      BasePanel.prototype.init.call(this);
      var el = this.el;
      el.classList.add('rs-bp3d-spanel');
      el.style.width =  '90%' ;
      el.style.height = 'auto';

      // Setup data
      this.settings = {
        difficulty:'EASY',
        defaultCategory:0
      };

      // Playing instruction
      var c = this.container = document.createElement('div');
      c.className = 'rs-settingcontainer';
      el.appendChild(c);

      // Default option panel
      // Collect category index
      var lvl = this.config.data.level;
      var cat = [];
      for (var k in lvl) {
        cat.push(k);
      }
      this.cat = cat;

      // Preferences
      var sp = this;
      var am = this.bp3d.assetManager;

      // Default category panel
      var depanel = this.depanel = new OptionPanel(cat, function(idx) {
        sp.bp3d.pref.saveDefaultCategory(idx);
        sp.updateSettingItem();
        am.btnClick.play();
      });

      // Difficulty option panel
      var dpanel = this.dpanel = new OptionPanel(["EASY", "NORMAL", "HARD"], function(idx) {
        sp.bp3d.pref.saveDifficulty(idx);
        sp.updateSettingItem();
        am.btnClick.play();
      });

      this.sitem1 = this.buildSettingItem("Difficulty", dpanel);
      this.sitem2 = this.buildSettingItem("Default Category", depanel);
    };

    /**
     * Create and return a new setting item
     * @method buildSettingItem
     */
    SettingPanel.prototype.buildSettingItem = function(label, op) {

      var am = this.bp3d.assetManager;
      var root = document.createElement('div');
      root.className = 'rs-settingitem';

      // Title
      var title = document.createElement('h3');
      title.innerHTML = label;
      root.title = title;
      root.appendChild(title);
      
      // Button
      var btn = document.createElement('span');
      btn.innerHTML = 'Button';
      root.btn = btn;
      root.appendChild(btn);
      this.container.appendChild(root);
      btn.addEventListener('click', function(e) {

        op.show();
        am.btnClick.play();
      });
      return root;
    };

    /**
     * Show the panel
     * @method show
     */
    SettingPanel.prototype.show = function() {

      BasePanel.prototype.show.call(this);
      this.updateSettingItem();
    };

    /**
     * Update setting item values
     * @method updateSettingItem
     */
    SettingPanel.prototype.updateSettingItem = function() {

      var pref = this.bp3d.pref;
      var dlabel = ['EASY', 'NORMAL', 'HARD'];

      // Update difficulty
      this.sitem1.btn.innerHTML = dlabel[pref.data.difficulty];

      // Update default category
      this.sitem2.btn.innerHTML = this.cat[pref.data.defaultCategory].toUpperCase();
    };

    return SettingPanel;

  });
