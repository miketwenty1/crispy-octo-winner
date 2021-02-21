"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

// container player information like health and balance
var PlayerModel = /*#__PURE__*/function () {
  function PlayerModel(playerId, spawnLocations, players, username) {
    (0, _classCallCheck2["default"])(this, PlayerModel);
    this.health = 100;
    this.maxHealth = 100;
    this.bitcoin = 0;
    this.id = playerId;
    this.spawnLocations = spawnLocations;
    this.flipX = true;
    this.playerAttacking = false; // this.currentDirection = ;

    var location = this.generateLocation(players); // short hand to set 2 values 1st and 2nd item of location array

    var _location = (0, _slicedToArray2["default"])(location, 2);

    this.x = _location[0];
    this.y = _location[1];
    this.username = username;
  }

  (0, _createClass2["default"])(PlayerModel, [{
    key: "updateBitcoin",
    value: function updateBitcoin(bitcoin) {
      this.bitcoin += bitcoin;
    }
  }, {
    key: "updateHealth",
    value: function updateHealth(damage) {
      this.health -= damage;

      if (this.health > this.maxHealth) {
        this.health = this.maxHealth;
      } // console.log('damage was '+damage+ ', now health is '+this.health);

    }
  }, {
    key: "respawn",
    value: function respawn(players) {
      this.health = this.maxHealth;
      var location = this.generateLocation(players);

      var _location2 = (0, _slicedToArray2["default"])(location, 2);

      this.x = _location2[0];
      this.y = _location2[1];
    }
  }, {
    key: "generateLocation",
    value: function generateLocation(players) {
      var location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
      var invalidLocation = Object.keys(players).some(function (key) {
        if (players[key].x === location[0] && players[key].y === location[1]) {
          return true;
        }

        return false;
      });

      if (invalidLocation) {
        return this.generateLocation(players);
      }

      return location;
    }
  }]);
  return PlayerModel;
}();

exports["default"] = PlayerModel;
//# sourceMappingURL=PlayerModel.js.map