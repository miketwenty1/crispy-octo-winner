import Spawner from './Spawner';
import PlayerModel from './PlayerModel';

import { SpawnerType, Mode, DIFFICULTY } from './utils';

export default class GameManager {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

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
    this.setupEventListener();
    this.setupSpawners();
    this.spawnPlayer();
  }

  parseMapData() {
    this.mapData.forEach((layer) => {
      if (layer.name === 'player_locations') {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([obj.x, obj.y]);
        });
      } else if (layer.name === 'chest_locations') {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      } else if (layer.name === 'monster_locations') {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      }
    });
    // console.log(this.playerLocations);
    // console.log(this.chestLocations);
    // console.log(this.monsterLocations);
  }

  setupEventListener() {
    this.scene.events.on('pickUpChest', (chestId, playerId) => {
      // update spawner
      if (this.chests[chestId]) {
        // short hand for setting bitcoin variable from chests[chestId].bitcoin this is probably a bad idea.. just trying to learn javascript and see if this works.
        const { bitcoin } = this.chests[chestId];

        // updating player balance
        this.players[playerId].updateBitcoin(bitcoin);
        this.scene.events.emit('updateBalance', this.players[playerId].bitcoin);

        // remove chest
        this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
        this.scene.events.emit('chestRemoved', chestId);
      }
    });
    this.scene.events.on('monsterAtttacked', (monsterId, playerId) => {
      // update spawner
      // console.log('debug: '+ Object.keys(this.players[playerId]));
      // console.log('playerid: '+playerId);
      if (this.monsters[monsterId]) {
        const { bitcoin, attack } = this.monsters[monsterId];
        this.monsters[monsterId].loseHealth(2 * Mode[DIFFICULTY]);
        // console.log('health' + this.monsters[monsterId].health);
        // check health remove monster if dead

        if (this.monsters[monsterId].health <= 0) {
          this.players[playerId].updateBitcoin(bitcoin);
          this.scene.events.emit('updateBalance', this.players[playerId].bitcoin);
          // console.log('health2' + this.monsters[monsterId].health);
          this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
          this.scene.events.emit('monsterRemoved', monsterId);
          // give player some more health if they kill a monster
          this.players[playerId].updateHealth(-10);
          this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);
        } else {
          this.players[playerId].updateHealth(attack);
          // update player health
          this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);
          // update monster health
          this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);

          // respawn player if he be ded
          if (this.players[playerId].health <= 0) {
            // update balance to take a 50% penalty
            // 10 represents the "radix" i believe this should be 10 for base 10 numbering
            const reduceAmount = parseInt(-this.players[playerId].bitcoin / 2, 10);
            // console.log(reduceAmount);
            this.players[playerId].updateBitcoin(reduceAmount);
            this.scene.events.emit('updateBalance', this.players[playerId].bitcoin);
            // respawn
            this.players[playerId].respawn();
            this.scene.events.emit('respawnPlayer', this.players[playerId]);
          }
        }
      }
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

  spawnPlayer() {
    const player = new PlayerModel(this.playerLocations);
    this.players[player.id] = player;
    this.scene.events.emit('spawnPlayer', player);
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    this.scene.events.emit('chestSpawned', chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    this.scene.events.emit('monsterSpawned', monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
  }

  moveMonsters() {
    this.scene.events.emit('monsterMovement', this.monsters);
  }
}
