import { v4 } from 'uuid';
import Scale from '../utils/scale';
import { randomNumber } from './utils';

export default class MonsterModel {
  constructor(x, y, bitcoin, spawnerId, frame, health, attack) {
    this.id = `${spawnerId}-${v4()}`;
    this.spawnerId = spawnerId;
    this.x = x * Scale.FACTOR;
    this.y = y * Scale.FACTOR;
    this.bitcoin = bitcoin;
    this.frame = frame;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
    // console.log('health: '+this.health+'  maxhealth: '+this.maxHealth);
  }

  loseHealth(damage) {
    // console.log('spawnerid: '+this.spawnerId+'health: '+this.health+'  maxhealth: '+this.maxHealth+'frame: '+this.frame);
    this.health -= damage;
    // console.log('spawnerid: '+this.spawnerId+'health: '+this.health+'  maxhealth: '+this.maxHealth+'frame: '+this.frame);
  }

  move() {
    const randomPosition = randomNumber(1, 8);
    const distance = 32 * Scale.FACTOR * 3;

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
}
