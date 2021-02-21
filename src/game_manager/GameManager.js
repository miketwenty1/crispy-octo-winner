import PlayerModel from './PlayerModel';
import * as levelData from '../../public/assets/level/large_level.json';
import Spawner from './Spawner';
import { SpawnerType, Mode, DIFFICULTY } from './utils';
// in charge of managing game state for player's game
export default class GameManager {
  constructor(io) {
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
  }

  setup() {
    this.parseMapData();
    this.setupEventListeners();
    this.setupSpawners();
  }

  parseMapData() {
    this.levelData = levelData;
    this.levelData.layers.forEach((layer) => {
      if (layer.name === 'player_locations') {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([obj.x, obj.y]);
        });
      } else if (layer.name === 'monster_locations') {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      } else if (layer.name === 'chest_locations') {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      }
    });
  }

  setupEventListeners() {
    this.io.on('connection', (socket) => {
      // when a player connects
      console.log('player connected to our game');
      console.log(socket.id);
      socket.on('disconnect', (reason) => {
        // delete userdata from server
        delete this.players[socket.id];
        // emit message to remove this player
        this.io.emit('playerDisconnect', socket.id);
        // when a player disconnects
        console.log(`player disconnected from game because: ${reason}`);
        console.log(socket.id);
      });

      socket.on('newPlayer', () => {
        this.spawnPlayer(socket.id);

        // send players to new player
        socket.emit('currentPlayers', this.players);
        // send monsters to new player
        socket.emit('currentMonsters', this.monsters);
        // send chests to new player
        socket.emit('currentChests', this.chests);
        // send new player to all players
        socket.broadcast.emit('spawnPlayer', this.players[socket.id]);
      });
      socket.on('playerMovement', (playerData) => {
        if (this.players[socket.id]) {
          this.players[socket.id].x = playerData.x;
          this.players[socket.id].y = playerData.y;
          this.players[socket.id].flipX = playerData.flipX;
          this.players[socket.id].playerAttacking = playerData.playerAttacking;
          this.players[socket.id].currentDirection = playerData.currentDirection;

          // emit message to all players letting them know about the updated position
          this.io.emit('playerMoved', this.players[socket.id]);
        }
      });
      socket.on('pickUpChest', (chestId) => {
        // update spawner
        if (this.chests[chestId]) {
          // short hand for setting bitcoin variable from chests[chestId].bitcoin this is probably a bad idea.. just trying to learn javascript and see if this works.
          const { bitcoin } = this.chests[chestId];

          // updating player balance
          this.players[socket.id].updateBitcoin(bitcoin);
          socket.emit('updateBalance', this.players[socket.id].bitcoin);

          // remove chest this somehow calls deleteChest event (need to verify this).
          this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
        }
      });
      socket.on('monsterAtttacked', (monsterId) => {
        // update spawner
        // console.log('debug: '+ Object.keys(this.players[playerId]));
        // console.log('playerid: '+playerId);
        if (this.monsters[monsterId]) {
          const { bitcoin, attack } = this.monsters[monsterId];
          this.monsters[monsterId].loseHealth(2 * Mode[DIFFICULTY]);
          // console.log('health' + this.monsters[monsterId].health);
          // check health remove monster if dead
          if (this.monsters[monsterId].health <= 0) {
            this.players[socket.id].updateBitcoin(bitcoin);
            socket.emit('updateBalance', this.players[socket.id].bitcoin);
            // console.log('health2' + this.monsters[monsterId].health);
            this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
            this.io.emit('monsterRemoved', monsterId);
            // give player some more health if they kill a monster
            this.players[socket.id].updateHealth(-10);
            this.io.emit('updatePlayerHealth', socket.id, this.players[socket.id].health);
          } else {
            this.players[socket.id].updateHealth(attack);
            // update player health
            this.io.emit('updatePlayerHealth', socket.id, this.players[socket.id].health);
            // update monster health
            this.io.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);

            // respawn player if he be ded
            if (this.players[socket.id].health <= 0) {
              // update balance to take a 50% penalty
              // 10 represents the "radix" i believe this should be 10 for base 10 numbering
              const reduceAmount = parseInt(-this.players[socket.id].bitcoin / 2, 10);
              // console.log(reduceAmount);
              this.players[socket.id].updateBitcoin(reduceAmount);
              socket.emit('updateBalance', this.players[socket.id].bitcoin);
              // respawn
              this.players[socket.id].respawn(this.players);
              this.io.emit('respawnPlayer', this.players[socket.id]);
            }
          }
        }
      });
      socket.on('attackedPlayer', (attackedPlayerId) => {
        if (this.players[attackedPlayerId]) {
          // get balance
          const { bitcoin } = this.players[attackedPlayerId];
          // subtract health
          this.players[attackedPlayerId].updateHealth(10);
          // check health of attacked player if dead send gold to attacker
          if (this.players[attackedPlayerId].health <= 0) {
            // dead player loses half of the gold to attacker
            this.players[socket.id].updateBitcoin(bitcoin);
            // respawn attacked player
            this.players[attackedPlayerId].respawn(this.players);
            this.io.emit('respawnPlayer', this.players[attackedPlayerId]);
            // send update balance message to player
            socket.emit('updateBalance', this.players[socket.id].bitcoin);
            // reset dead players gold
            this.players[attackedPlayerId].updateBitcoin(-bitcoin);
            // io.to sends to a specific socket
            this.io.to(`${attackedPlayerId}`).emit('updateBalance', this.players[attackedPlayerId].bitcoin);
            // add bonus health to player
            this.players[socket.id].updateHealth(-20);
            this.io.emit('updatePlayerHealth', socket.id, this.players[socket.id].health);
          } else {
            this.io.emit('updatePlayerHealth', attackedPlayerId, this.players[attackedPlayerId].health);
          }
        }
      });
      console.log('new player connected', socket.id);
    });
  }

  setupSpawners() {
    const config = {
      spawnInterval: 3000,
      limit: 3,
      spawnerType: '',
      id: '',
    };
    let spawner;

    Object.keys(this.chestLocations).forEach((key) => {
      config.id = `chest-${key}`;
      config.spawnerType = SpawnerType.CHEST;
      spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this),
      );
      this.spawners[spawner.id] = spawner;
    });

    Object.keys(this.monsterLocations).forEach((key) => {
      config.id = `monster-${key}`;
      config.spawnerType = SpawnerType.MONSTER;

      spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this),
        this.moveMonsters.bind(this),
      );
      this.spawners[spawner.id] = spawner;
    });
  }

  spawnPlayer(playerId) {
    const player = new PlayerModel(playerId, this.playerLocations, this.players);
    this.players[playerId] = player;
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    this.io.emit('chestSpawned', chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
    this.io.emit('chestRemoved', chestId);
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    this.io.emit('monsterSpawned', monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
    this.io.emit('monsterRemoved', monsterId);
  }

  moveMonsters() {
    this.io.emit('monsterMovement', this.monsters);
  }
}