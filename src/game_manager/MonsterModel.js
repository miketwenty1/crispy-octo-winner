import { v4 } from 'uuid';
import { randomNumber, Scale, Map } from './utils';

export default class MonsterModel {
  constructor(x, y, bitcoin, spawnerId, frame, health, attack, mVelocity, movementIntervalTime) {
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
    this.movementIntervalTime = movementIntervalTime;
  }

  loseHealth(damage) {
    this.health -= damage;
  }

  move() {
    const randomAngle = randomNumber(1, 360);
    const radian = (randomAngle * Math.PI) / 180;
    const monsterPixels = 32 * 2 * Scale.FACTOR;
    // also take into account monster width / height in case origin of monster is top/right.
    const mapWidthScaled = (Map.TileWidth * 32 * Scale.FACTOR);
    const mapHeightScaled = Map.TileHeight * 32 * Scale.FACTOR;
    const randomSpeedMultiplier = randomNumber(1, 3);
    let newY = Math.sin(radian) * this.mVelocity * randomSpeedMultiplier;
    let newX = Math.cos(radian) * this.mVelocity * randomSpeedMultiplier;

    // check for out of bounds
    if (this.x + newX > mapWidthScaled) {
      newX = (mapWidthScaled - this.x) - monsterPixels;
    } else if (this.x + newX < 0) {
      newX = this.x + monsterPixels;
    } else {
      //
    }
    if (this.y + newY > mapHeightScaled) {
      newY = (mapHeightScaled - this.y) - monsterPixels;
    } else if (this.y + newY < 0) {
      newY = this.y + monsterPixels;
    } else {
      //
    }

    this.x += newX;
    this.y += newY;
    // there is logic in each if statement to also provide if logic on whether or not the monster goes out of bounds
    // 1 - 90 degrees

    if (this.x > 3840 || this.y > 3840) {
      console.log('monster on the run');
      console.log(`degrees: ${randomAngle} - x: ${this.x}, (newX): ${newX} y: ${this.y}, (newY): ${newY}, distance: ${this.mVelocity}`);
    }
    // this.mVelocity = randomNumber(20, 312);
  }
}
