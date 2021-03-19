import {
  SpawnerType,
  randomNumber,
  Intervals,
  Movement,
} from './utils';
import ChestModel from '../models/ChestModel';
import MonsterModel from '../models/MonsterModel';

export default class Spawner {
  constructor(config, spawnLocations, addObject, deleteObject, moveObjects) {
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

  start() {
    this.interval = setInterval(() => {
      if (this.objectsCreated.length < this.limit) {
        this.spawnObject();
      }
    }, this.spawnInterval);
    if (this.objectType === SpawnerType.MONSTER) {
      this.moveMonsters();
    }
  }

  spawnObject() {
    if (this.objectType === SpawnerType.CHEST) {
      this.spawnChest();
    } else if (this.objectType === SpawnerType.MONSTER) {
      this.spawnMonster();
    }
  }

  spawnChest() {
    const location = this.pickRandomLocation('chest', 1);
    const chest = new ChestModel(location[0], location[1], randomNumber(1, 21), this.id);
    this.objectsCreated.push(chest);
    this.addObject(chest.id, chest);
  }

  spawnMonster() {
    const monsterNum = randomNumber(0, 20);
    const attack = (monsterNum + 1) * 2;
    const health = (monsterNum + 1) * 4;
    const mVelocity = Movement.MONSTER;
    const location = this.pickRandomLocation('monster', 1);
    const monster = new MonsterModel(
      location[0],
      location[1],
      randomNumber(21, 21 + attack + health), // coins drop more powerful more likely to drop coins
      this.id,
      monsterNum,
      health,
      attack,
      mVelocity,
      Intervals.Movement.MONSTER,
      Intervals.ResetLocation.MONSTER,
    );
    this.objectsCreated.push(monster);
    this.addObject(monster.id, monster);
  }

  pickRandomLocation(who, num) {
    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    // some used in an interesting way here
    const invalidLocation = this.objectsCreated.some((obj) => {
      if (obj.x === location[0] && obj.y === location[1]) {
        return true;
      }
      return false;
    });
    if (invalidLocation) {
      console.log(`location from ${who} with num: ${num}`);
      return this.pickRandomLocation(who, num + 1);
    }
    return location;
  }

  removeObject(id) {
    // filter will return the objects inside our current array that meets
    // the true value that we specified in the call back
    // we want to get back the id's minus the one we passed in
    this.objectsCreated = this.objectsCreated.filter((obj) => obj.id !== id);
    this.deleteObject(id);
  }

  moveMonsters() {
    this.moveMonsterInterval = setInterval(() => {
      this.objectsCreated.forEach((monster) => {
        monster.move();
      });
      this.moveObjects();
    }, Intervals.Movement.MONSTER);
  }
}
