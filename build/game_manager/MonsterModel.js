"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _uuid = require("uuid");

var _utils = require("./utils");

var MonsterModel = /*#__PURE__*/function () {
  function MonsterModel(x, y, bitcoin, spawnerId, frame, health, attack, mVelocity, movementIntervalTime) {
    (0, _classCallCheck2["default"])(this, MonsterModel);
    this.id = "".concat(spawnerId, "-").concat((0, _uuid.v4)());
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.bitcoin = bitcoin;
    this.frame = frame;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
    this.mVelocity = mVelocity;
    this.movementIntervalTime = movementIntervalTime;
  }

  (0, _createClass2["default"])(MonsterModel, [{
    key: "loseHealth",
    value: function loseHealth(damage) {
      this.health -= damage;
    }
  }, {
    key: "move",
    value: function move() {
      var randomAngle = (0, _utils.randomNumber)(1, 360);
      var radian = randomAngle * Math.PI / 180;
      var monsterPixels = 32 * 2 * _utils.Scale.FACTOR; // also take into account monster width / height in case origin of monster is top/right.

      var mapWidthScaled = _utils.Map.TileWidth * 32 * _utils.Scale.FACTOR;
      var mapHeightScaled = _utils.Map.TileHeight * 32 * _utils.Scale.FACTOR;
      var randomSpeedMultiplier = (0, _utils.randomNumber)(1, 3);
      var newY = Math.sin(radian) * this.mVelocity * randomSpeedMultiplier;
      var newX = Math.cos(radian) * this.mVelocity * randomSpeedMultiplier; // check for out of bounds

      if (this.x + newX > mapWidthScaled) {
        newX = mapWidthScaled - this.x - monsterPixels;
      } else if (this.x + newX < 0) {
        newX = this.x + monsterPixels;
      } else {//
      }

      if (this.y + newY > mapHeightScaled) {
        newY = mapHeightScaled - this.y - monsterPixels;
      } else if (this.y + newY < 0) {
        newY = this.y + monsterPixels;
      } else {//
      }

      this.x += newX;
      this.y += newY; // there is logic in each if statement to also provide if logic on whether or not the monster goes out of bounds
      // 1 - 90 degrees

      if (this.x > 3840 || this.y > 3840) {
        console.log('monster on the run');
        console.log("degrees: ".concat(randomAngle, " - x: ").concat(this.x, ", (newX): ").concat(newX, " y: ").concat(this.y, ", (newY): ").concat(newY, ", distance: ").concat(this.mVelocity));
      } // this.mVelocity = randomNumber(20, 312);

    }
  }]);
  return MonsterModel;
}();

exports["default"] = MonsterModel;
//# sourceMappingURL=MonsterModel.js.map