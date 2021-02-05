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
  function MonsterModel(x, y, bitcoin, spawnerId, frame, health, attack) {
    (0, _classCallCheck2["default"])(this, MonsterModel);
    this.id = "".concat(spawnerId, "-").concat((0, _uuid.v4)());
    this.spawnerId = spawnerId;
    this.x = x * _utils.Scale.FACTOR;
    this.y = y * _utils.Scale.FACTOR;
    this.bitcoin = bitcoin;
    this.frame = frame;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack; // console.log('health: '+this.health+'  maxhealth: '+this.maxHealth);
  }

  (0, _createClass2["default"])(MonsterModel, [{
    key: "loseHealth",
    value: function loseHealth(damage) {
      // console.log('spawnerid: '+this.spawnerId+'health: '+this.health+'  maxhealth: '+this.maxHealth+'frame: '+this.frame);
      this.health -= damage; // console.log('spawnerid: '+this.spawnerId+'health: '+this.health+'  maxhealth: '+this.maxHealth+'frame: '+this.frame);
    }
  }, {
    key: "move",
    value: function move() {
      var randomPosition = (0, _utils.randomNumber)(1, 8);
      var distance = 32 * _utils.Scale.FACTOR * 3;

      switch (randomPosition) {
        case 1:
          this.x += distance;
          break;

        case 2:
          this.x -= distance;
          break;

        case 3:
          this.y += distance;
          break;

        case 4:
          this.y -= distance;
          break;

        case 5:
          this.y -= distance;
          this.x += distance;
          break;

        case 6:
          this.y -= distance;
          this.x -= distance;
          break;

        case 7:
          this.y += distance;
          this.x += distance;
          break;

        case 8:
          this.y += distance;
          this.x -= distance;
          break;

        default:
          console.log('Error: default monster movement reached');
          break;
      }
    }
  }]);
  return MonsterModel;
}();

exports["default"] = MonsterModel;
//# sourceMappingURL=MonsterModel.js.map