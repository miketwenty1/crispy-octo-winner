"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _utils = require("./utils");

var _ChestModel = _interopRequireDefault(require("../models/ChestModel"));

var _MonsterModel = _interopRequireDefault(require("../models/MonsterModel"));

var Spawner = /*#__PURE__*/function () {
  function Spawner(config, spawnLocations, addObject, deleteObject, moveObjects) {
    (0, _classCallCheck2["default"])(this, Spawner);
    this.id = config.id;
    this.spawnInterval = config.spawnInterval;
    this.limit = config.limit;
    this.objectType = config.spawnerType;
    this.spawnLocations = spawnLocations;
    this.addObject = addObject;
    this.deleteObject = deleteObject;
    this.objectsCreated = [];
    this.start();
    this.moveObjects = moveObjects;
  }

  (0, _createClass2["default"])(Spawner, [{
    key: "start",
    value: function start() {
      var _this = this;

      this.interval = setInterval(function () {
        if (_this.objectsCreated.length < _this.limit) {
          _this.spawnObject();
        }
      }, this.spawnInterval);

      if (this.objectType === _utils.SpawnerType.MONSTER) {
        this.moveMonsters();
      }
    }
  }, {
    key: "spawnObject",
    value: function spawnObject() {
      if (this.objectType === _utils.SpawnerType.CHEST) {
        this.spawnChest();
      } else if (this.objectType === _utils.SpawnerType.MONSTER) {
        this.spawnMonster();
      }
    }
  }, {
    key: "spawnChest",
    value: function spawnChest() {
      var location = this.pickRandomLocation('chest', 1);
      var chest = new _ChestModel["default"](location[0], location[1], (0, _utils.randomNumber)(1, 21), this.id);
      this.objectsCreated.push(chest);
      this.addObject(chest.id, chest);
    }
  }, {
    key: "spawnMonster",
    value: function spawnMonster() {
      var monsterNum = (0, _utils.randomNumber)(0, 20);
      var attack = (monsterNum + 1) * 2;
      var health = (monsterNum + 1) * 4;
      var mVelocity = _utils.Movement.MONSTER;
      var location = this.pickRandomLocation('monster', 1);
      var monster = new _MonsterModel["default"](location[0], location[1], (0, _utils.randomNumber)(21, 21 + attack + health), // coins drop more powerful more likely to drop coins
      this.id, monsterNum, health, attack, mVelocity, _utils.Intervals.Movement.MONSTER, _utils.Intervals.ResetLocation.MONSTER);
      this.objectsCreated.push(monster);
      this.addObject(monster.id, monster);
    }
  }, {
    key: "pickRandomLocation",
    value: function pickRandomLocation(who, num) {
      var location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)]; // some used in an interesting way here

      var invalidLocation = this.objectsCreated.some(function (obj) {
        if (obj.x === location[0] && obj.y === location[1]) {
          return true;
        }

        return false;
      });

      if (invalidLocation) {
        console.log("location from ".concat(who, " with num: ").concat(num));
        return this.pickRandomLocation(who, num + 1);
      }

      return location;
    }
  }, {
    key: "removeObject",
    value: function removeObject(id) {
      // filter will return the objects inside our current array that meets
      // the true value that we specified in the call back
      // we want to get back the id's minus the one we passed in
      this.objectsCreated = this.objectsCreated.filter(function (obj) {
        return obj.id !== id;
      });
      this.deleteObject(id);
    }
  }, {
    key: "moveMonsters",
    value: function moveMonsters() {
      var _this2 = this;

      this.moveMonsterInterval = setInterval(function () {
        _this2.objectsCreated.forEach(function (monster) {
          monster.move();
        });

        _this2.moveObjects();
      }, _utils.Intervals.Movement.MONSTER);
    }
  }]);
  return Spawner;
}();

exports["default"] = Spawner;
//# sourceMappingURL=Spawner.js.map