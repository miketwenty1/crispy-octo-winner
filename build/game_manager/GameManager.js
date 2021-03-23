"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _PlayerModel = _interopRequireDefault(require("../models/PlayerModel"));

var levelData = _interopRequireWildcard(require("../../public/assets/level/large_level.json"));

var _Spawner = _interopRequireDefault(require("./Spawner"));

var _ChatModel = _interopRequireDefault(require("../models/ChatModel"));

var _utils = require("./utils");

// in charge of managing game state for player's game
var GameManager = /*#__PURE__*/function () {
  function GameManager(io) {
    (0, _classCallCheck2["default"])(this, GameManager);
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.items = {};
    this.monsters = {};
    this.players = {};
    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {}; // itemData.locations;

    this.itemLocations = {};
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
        } else if (layer.name === 'item_locations') {
          layer.objects.forEach(function (obj) {
            if (_this.itemLocations[obj.properties[0].value]) {
              _this.itemLocations[obj.properties[0].value].push([obj.x * _utils.Scale.FACTOR, obj.y * _utils.Scale.FACTOR]);
            } else {
              _this.itemLocations[obj.properties[0].value] = [[obj.x * _utils.Scale.FACTOR, obj.y * _utils.Scale.FACTOR]];
            }
          });
        } else {
          console.log(layer.name);
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
            var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET); // make sure socket isn't being reused
            // console.log(this.players);
            // console.log(socket.id);
            // console.log(!(socket.id in this.players));


            if (!(socket.id in _this2.players)) {
              // get players name
              console.log("new player, with decoded value of ".concat(JSON.stringify(decoded)));
              console.log("this is the frame going to the server from newPlayer on socket ".concat(frame));
              var username = decoded.user.username;

              _this2.spawnPlayer(socket.id, username, frame); // send players to new player


              socket.emit('currentPlayers', _this2.players); // send monsters to new player

              socket.emit('currentMonsters', _this2.monsters); // send chests to new player

              socket.emit('currentChests', _this2.chests); // send item objects to new players

              socket.emit('currentItems', _this2.items); // send new player to all players

              socket.broadcast.emit('spawnPlayer', _this2.players[socket.id]); // console.log('spawning player');
              // console.log(this.players[socket.id]);
            }
          } catch (err) {
            // reject login
            console.log("err with validating jwt token ".concat(err.message));
            socket.emit('invalidToken');
          }
        });
        socket.on('playerMovement', function (playerData) {
          if (!_this2.players[socket.id]) {
            console.log('somehow playerMovement we got an undefined player');

            _this2.checkSocket(socket);
          } else if (_this2.players[socket.id]) {
            _this2.players[socket.id].x = playerData.x;
            _this2.players[socket.id].y = playerData.y;
            _this2.players[socket.id].flipX = playerData.flipX;
            _this2.players[socket.id].playerAttacking = playerData.playerAttacking;
            _this2.players[socket.id].weaponDirection = playerData.weaponDirection; // console.log(`yeah ${playerData.weaponDirection.angle}`);
            // emit message to all players letting them know about the updated position

            _this2.io.emit('playerMoved', _this2.players[socket.id]);
          }
        });
        socket.on('sendMessage', /*#__PURE__*/function () {
          var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, token) {
            var decoded, _decoded$user, username, email;

            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (_this2.players[socket.id]) {
                      _context.next = 5;
                      break;
                    }

                    console.log('somehow sendMessage we got an undefined player');

                    _this2.checkSocket(socket);

                    _context.next = 17;
                    break;

                  case 5:
                    _context.prev = 5;
                    decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                    _decoded$user = decoded.user, username = _decoded$user.username, email = _decoded$user.email;
                    _context.next = 10;
                    return _ChatModel["default"].create({
                      email: email,
                      message: message
                    });

                  case 10:
                    // console.log(username, message);
                    _this2.io.emit('newMessage', {
                      username: username,
                      message: message,
                      frame: _this2.players[socket.id].frame
                    });

                    _context.next = 17;
                    break;

                  case 13:
                    _context.prev = 13;
                    _context.t0 = _context["catch"](5);
                    console.log("err with validating jwt token ".concat(_context.t0.message));
                    socket.emit('invalidToken');

                  case 17:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, null, [[5, 13]]);
          }));

          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }());
        socket.on('pickUpItem', function (itemId) {
          if (!_this2.players[socket.id]) {
            console.log('somehow pickUpChest we got an undefined player');

            _this2.checkSocket(socket);
          } else if (_this2.items[itemId]) {
            // check to see if player is elgible to pickup item
            if (_this2.players[socket.id].canPickupItem()) {
              _this2.players[socket.id].addItem(_this2.items[itemId]);

              socket.emit('updateItems', _this2.players[socket.id]);
              socket.broadcast.emit('updatePlayersItems', socket.id, _this2.players[socket.id]); // remove item from spawner

              _this2.spawners[_this2.items[itemId].spawnerId].removeObject(itemId);
            }
          }
        });
        socket.on('playerDroppedItem', function (itemId) {
          if (!_this2.players[socket.id]) {
            console.log('somehow pickUpChest we got an undefined player');

            _this2.checkSocket(socket);
          } else {
            console.log("item ".concat(itemId, " being removed from ").concat(_this2.players[socket.id].username));

            _this2.players[socket.id].removeItem(itemId);

            socket.emit('updateItems', _this2.players[socket.id]);
            socket.broadcast.emit('updatePlayersItems', socket.id, _this2.players[socket.id]);
          }
        });
        socket.on('pickUpChest', function (chestId) {
          if (!_this2.players[socket.id]) {
            console.log('somehow pickUpChest we got an undefined player');

            _this2.checkSocket(socket);
          } else if (_this2.chests[chestId]) {
            // short hand for setting bitcoin variable from chests[chestId].bitcoin this is probably a bad idea.. just trying to learn javascript and see if this works.
            var bitcoin = _this2.chests[chestId].bitcoin; // updating player balance

            _this2.players[socket.id].updateBitcoin(bitcoin);

            socket.emit('updateBalance', _this2.players[socket.id].bitcoin);
            socket.broadcast.emit('updatePlayersBalance', socket.id, _this2.players[socket.id].bitcoin); // remove chest this somehow calls deleteChest event (need to verify this).

            _this2.spawners[_this2.chests[chestId].spawnerId].removeObject(chestId);
          }
        });
        socket.on('healPlayer', function () {
          if (!_this2.players[socket.id]) {
            console.log('somehow healPlayer we got an undefined player');

            _this2.checkSocket(socket);
          } else if (_this2.players[socket.id].health < _this2.players[socket.id].maxHealth) {
            _this2.players[socket.id].updateHealth(-1);

            _this2.io.emit('updatePlayerHealth', socket.id, _this2.players[socket.id].health);
          }
        });
        socket.on('monsterOverlap', function (monsterId) {
          if (!_this2.players[socket.id]) {
            console.log('somehow monsterOverlap we got an undefined player');

            _this2.checkSocket(socket);
          } else if (_this2.monsters[monsterId]) {
            _this2.players[socket.id].updateHealth(1);

            _this2.io.emit('updatePlayerHealth', socket.id, _this2.players[socket.id].health);

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
        });
        socket.on('monsterAttacked', function (monsterId) {
          // update spawner
          // console.log('debug: '+ Object.keys(this.players[playerId]));
          // console.log('playerid: '+playerId);
          if (!_this2.players[socket.id]) {
            console.log('somehow monsterAttacked we got an undefined player');

            _this2.checkSocket(socket);
          } else if (_this2.monsters[monsterId]) {
            var _this2$monsters$monst = _this2.monsters[monsterId],
                bitcoin = _this2$monsters$monst.bitcoin,
                attack = _this2$monsters$monst.attack;
            var playerAttackValue = _this2.players[socket.id].attack;

            _this2.monsters[monsterId].loseHealth(playerAttackValue); // console.log('health' + this.monsters[monsterId].health);
            // check health remove monster if dead


            if (_this2.monsters[monsterId].health <= 0) {
              _this2.players[socket.id].updateBitcoin(bitcoin);

              socket.emit('updateBalance', _this2.players[socket.id].bitcoin); // console.log('health2' + this.monsters[monsterId].health);

              _this2.spawners[_this2.monsters[monsterId].spawnerId].removeObject(monsterId);

              _this2.io.emit('monsterRemoved', monsterId); // give player some more health if they kill a monster


              _this2.players[socket.id].updateHealth(-10);

              _this2.io.emit('updatePlayerHealth', socket.id, _this2.players[socket.id].health);
            } else {
              _this2.players[socket.id].playerAttacked(attack); // update player health


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
          if (!_this2.players[socket.id]) {
            console.log('somehow attackedPlayer we got an undefined player');

            _this2.checkSocket(socket);
          } else if (_this2.players[attackedPlayerId]) {
            // get balance
            var bitcoin = _this2.players[attackedPlayerId].bitcoin;
            var playerAttackValue = _this2.players[socket.id].attack; // subtract health

            _this2.players[attackedPlayerId].playerAttacked(playerAttackValue); // check health of attacked player if dead send gold to attacker


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
        spawner = new _Spawner["default"](config, _this3.monsterLocations[key], _this3.addMonster.bind(_this3), _this3.deleteMonster.bind(_this3), _this3.moveMonsters.bind(_this3));
        _this3.spawners[spawner.id] = spawner;
      }); // create item spawner

      Object.keys(this.itemLocations).forEach(function (key) {
        config.id = "item-".concat(key);
        config.spawnerType = _utils.SpawnerType.ITEM;
        config.limit = 1;
        config.spawnInterval = 1000 * 1;
        spawner = new _Spawner["default"](config, _this3.itemLocations[key], _this3.addItem.bind(_this3), _this3.deleteItem.bind(_this3));
        _this3.spawners[spawner.id] = spawner;
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
    key: "addItem",
    value: function addItem(itemId, item) {
      this.items[itemId] = item;
      this.io.emit('itemSpawned', item);
    }
  }, {
    key: "deleteItem",
    value: function deleteItem(itemId) {
      delete this.items[itemId];
      this.io.emit('itemRemoved', itemId);
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
  }, {
    key: "checkSocket",
    value: function checkSocket(socket) {
      if (!this.players[socket.id]) {
        this.io.emit('playerDisconnect', socket.id);
        console.log('err with validating jwt token during checkSocket()');
        socket.emit('invalidToken');
      }
    }
  }]);
  return GameManager;
}();

exports["default"] = GameManager;
//# sourceMappingURL=GameManager.js.map