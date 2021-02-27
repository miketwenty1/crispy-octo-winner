"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _PlayerModel = _interopRequireDefault(require("./PlayerModel"));

var levelData = _interopRequireWildcard(require("../../public/assets/level/large_level.json"));

var _Spawner = _interopRequireDefault(require("./Spawner"));

var _utils = require("./utils");

// in charge of managing game state for player's game
var GameManager = /*#__PURE__*/function () {
  function GameManager(io) {
    (0, _classCallCheck2["default"])(this, GameManager);
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
    this.monsterCount = 0;
  }

  (0, _createClass2["default"])(GameManager, [{
    key: "setup",
    value: function setup() {
      this.parseMapData();
      this.setupEventListeners();
      this.setupSpawners();
    }
  }, {
    key: "parseMapData",
    value: function parseMapData() {
      var _this = this;

      this.levelData = levelData;
      this.levelData.layers.forEach(function (layer) {
        if (layer.name === 'player_locations') {
          layer.objects.forEach(function (obj) {
            _this.playerLocations.push([obj.x * _utils.Scale.FACTOR, obj.y * _utils.Scale.FACTOR]);
          });
        } else if (layer.name === 'monster_locations') {
          layer.objects.forEach(function (obj) {
            if (_this.monsterLocations[obj.properties[0].value]) {
              _this.monsterLocations[obj.properties[0].value].push([obj.x * _utils.Scale.FACTOR, obj.y * _utils.Scale.FACTOR]);
            } else {
              _this.monsterLocations[obj.properties[0].value] = [[obj.x * _utils.Scale.FACTOR, obj.y * _utils.Scale.FACTOR]];
            }
          });
        } else if (layer.name === 'chest_locations') {
          layer.objects.forEach(function (obj) {
            if (_this.chestLocations[obj.properties[0].value]) {
              _this.chestLocations[obj.properties[0].value].push([obj.x * _utils.Scale.FACTOR, obj.y * _utils.Scale.FACTOR]);
            } else {
              _this.chestLocations[obj.properties[0].value] = [[obj.x * _utils.Scale.FACTOR, obj.y * _utils.Scale.FACTOR]];
            }
          });
        }
      });
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;

      this.io.on('connection', function (socket) {
        // when a player connects
        console.log('player connected to our game');
        console.log(socket.id);
        socket.on('disconnect', function (reason) {
          // delete userdata from server
          delete _this2.players[socket.id]; // emit message to remove this player

          _this2.io.emit('playerDisconnect', socket.id); // when a player disconnects


          console.log("player disconnected from game because: ".concat(reason));
          console.log(socket.id);
        });
        socket.on('newPlayer', function (token, frame) {
          try {
            // validate token
            var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET); // get players name


            console.log("new player, with decoded value of ".concat(JSON.stringify(decoded)));
            console.log("this is the frame going to the server from newPlayer on socket ".concat(frame));
            var username = decoded.user.username;

            _this2.spawnPlayer(socket.id, username, frame); // send players to new player


            socket.emit('currentPlayers', _this2.players); // send monsters to new player

            socket.emit('currentMonsters', _this2.monsters); // send chests to new player

            socket.emit('currentChests', _this2.chests); // send new player to all players

            socket.broadcast.emit('spawnPlayer', _this2.players[socket.id]);
          } catch (err) {
            // reject login
            console.log("err with validating jwt token ".concat(err.message));
            socket.emit('invalidToken');
          }
        });
        socket.on('playerMovement', function (playerData) {
          if (_this2.players[socket.id]) {
            _this2.players[socket.id].x = playerData.x;
            _this2.players[socket.id].y = playerData.y;
            _this2.players[socket.id].flipX = playerData.flipX;
            _this2.players[socket.id].playerAttacking = playerData.playerAttacking;
            _this2.players[socket.id].currentDirection = playerData.currentDirection; // emit message to all players letting them know about the updated position

            _this2.io.emit('playerMoved', _this2.players[socket.id]);
          }
        });
        socket.on('pickUpChest', function (chestId) {
          // update spawner
          if (_this2.chests[chestId]) {
            // short hand for setting bitcoin variable from chests[chestId].bitcoin this is probably a bad idea.. just trying to learn javascript and see if this works.
            var bitcoin = _this2.chests[chestId].bitcoin; // updating player balance

            _this2.players[socket.id].updateBitcoin(bitcoin);

            socket.emit('updateBalance', _this2.players[socket.id].bitcoin); // remove chest this somehow calls deleteChest event (need to verify this).

            _this2.spawners[_this2.chests[chestId].spawnerId].removeObject(chestId);
          }
        });
        socket.on('monster', function (monsterId) {
          // update spawner
          // console.log('debug: '+ Object.keys(this.players[playerId]));
          // console.log('playerid: '+playerId);
          if (_this2.monsters[monsterId]) {
            var _this2$monsters$monst = _this2.monsters[monsterId],
                bitcoin = _this2$monsters$monst.bitcoin,
                attack = _this2$monsters$monst.attack;

            _this2.monsters[monsterId].loseHealth(2 * _utils.Mode[_utils.DIFFICULTY]); // console.log('health' + this.monsters[monsterId].health);
            // check health remove monster if dead


            if (_this2.monsters[monsterId].health <= 0) {
              _this2.players[socket.id].updateBitcoin(bitcoin);

              socket.emit('updateBalance', _this2.players[socket.id].bitcoin); // console.log('health2' + this.monsters[monsterId].health);

              _this2.spawners[_this2.monsters[monsterId].spawnerId].removeObject(monsterId);

              _this2.io.emit('monsterRemoved', monsterId); // give player some more health if they kill a monster


              _this2.players[socket.id].updateHealth(-10);

              _this2.io.emit('updatePlayerHealth', socket.id, _this2.players[socket.id].health);
            } else {
              _this2.players[socket.id].updateHealth(attack); // update player health


              _this2.io.emit('updatePlayerHealth', socket.id, _this2.players[socket.id].health); // update monster health


              _this2.io.emit('updateMonsterHealth', monsterId, _this2.monsters[monsterId].health); // respawn player if he be ded


              if (_this2.players[socket.id].health <= 0) {
                // update balance to take a 50% penalty
                // 10 represents the "radix" i believe this should be 10 for base 10 numbering
                var reduceAmount = parseInt(-_this2.players[socket.id].bitcoin / 2, 10); // console.log(reduceAmount);

                _this2.players[socket.id].updateBitcoin(reduceAmount);

                socket.emit('updateBalance', _this2.players[socket.id].bitcoin); // respawn

                _this2.players[socket.id].respawn(_this2.players);

                _this2.io.emit('respawnPlayer', _this2.players[socket.id]);
              }
            }
          }
        });
        socket.on('attackedPlayer', function (attackedPlayerId) {
          if (_this2.players[attackedPlayerId]) {
            // get balance
            var bitcoin = _this2.players[attackedPlayerId].bitcoin; // subtract health

            _this2.players[attackedPlayerId].updateHealth(10); // check health of attacked player if dead send gold to attacker


            if (_this2.players[attackedPlayerId].health <= 0) {
              // dead player loses half of the gold to attacker
              _this2.players[socket.id].updateBitcoin(bitcoin); // respawn attacked player


              _this2.players[attackedPlayerId].respawn(_this2.players);

              _this2.io.emit('respawnPlayer', _this2.players[attackedPlayerId]); // send update balance message to player


              socket.emit('updateBalance', _this2.players[socket.id].bitcoin); // reset dead players gold

              _this2.players[attackedPlayerId].updateBitcoin(-bitcoin); // io.to sends to a specific socket


              _this2.io.to("".concat(attackedPlayerId)).emit('updateBalance', _this2.players[attackedPlayerId].bitcoin); // add bonus health to player


              _this2.players[socket.id].updateHealth(-20);

              _this2.io.emit('updatePlayerHealth', socket.id, _this2.players[socket.id].health);
            } else {
              _this2.io.emit('updatePlayerHealth', attackedPlayerId, _this2.players[attackedPlayerId].health);
            }
          }
        });
        console.log('new player connected', socket.id);
      });
    }
  }, {
    key: "setupSpawners",
    value: function setupSpawners() {
      var _this3 = this;

      var config = {
        spawnInterval: _utils.Intervals.DEFAULT,
        limit: 3,
        spawnerType: '',
        id: ''
      };
      var spawner;
      Object.keys(this.chestLocations).forEach(function (key) {
        config.id = "chest-".concat(key);
        config.spawnerType = _utils.SpawnerType.CHEST;
        spawner = new _Spawner["default"](config, _this3.chestLocations[key], _this3.addChest.bind(_this3), _this3.deleteChest.bind(_this3));
        _this3.spawners[spawner.id] = spawner;
      });
      Object.keys(this.monsterLocations).forEach(function (key) {
        config.id = "monster-".concat(key);
        config.spawnerType = _utils.SpawnerType.MONSTER;

        if (_this3.monsterCount === 0) {
          spawner = new _Spawner["default"](config, _this3.monsterLocations[key], _this3.addMonster.bind(_this3), _this3.deleteMonster.bind(_this3), _this3.moveMonsters.bind(_this3));
          _this3.spawners[spawner.id] = spawner;
          _this3.monsterCount += 1;
        }
      });
    }
  }, {
    key: "spawnPlayer",
    value: function spawnPlayer(playerId, username, frame) {
      var player = new _PlayerModel["default"](playerId, this.playerLocations, this.players, username, frame);
      this.players[playerId] = player;
    }
  }, {
    key: "addChest",
    value: function addChest(chestId, chest) {
      this.chests[chestId] = chest;
      this.io.emit('chestSpawned', chest);
    }
  }, {
    key: "deleteChest",
    value: function deleteChest(chestId) {
      delete this.chests[chestId];
      this.io.emit('chestRemoved', chestId);
    }
  }, {
    key: "addMonster",
    value: function addMonster(monsterId, monster) {
      this.monsters[monsterId] = monster;
      this.io.emit('monsterSpawned', monster);
    }
  }, {
    key: "deleteMonster",
    value: function deleteMonster(monsterId) {
      delete this.monsters[monsterId];
      this.io.emit('monsterRemoved', monsterId);
    }
  }, {
    key: "moveMonsters",
    value: function moveMonsters() {
      this.io.emit('monsterMovement', this.monsters);
    }
  }]);
  return GameManager;
}();

exports["default"] = GameManager;
//# sourceMappingURL=GameManager.js.map