import { v4 } from 'uuid';
import { randomNumber } from './utils';

export default class MonsterModel {
  constructor(x, y, bitcoin, spawnerId, frame, health, attack, mVelocity) {
    this.id = `${spawnerId}-${v4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.bitcoin = bitcoin;
    this.frame = frame;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
    this.mVelocity = mVelocity;
  }

  loseHealth(damage) {
    this.health -= damage;
  }

  move() {
    const randomPosition = randomNumber(1, 8);
    const distance = 0; //32 * Scale.FACTOR * 3;

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
