import { v4 } from 'uuid';
import { randomNumber, Scale, Map } from './utils';

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
    const randomAngle = randomNumber(1, 360);
    const radian = (randomAngle * Math.PI) / 180;
    const distance = randomNumber(20, this.mVelocity);
    const mapWidthScaled = Map.TileWidth * 32 * Scale.FACTOR;
    const mapHeightScaled = Map.TileHeight * 32 * Scale.FACTOR;
    let newY = Math.sin(radian) * distance;
    let newX = Math.cos(radian) * distance;
    console.log(`PRE this.x: ${this.x}, this.y: ${this.y}`);
    console.log(`PRE new x: ${newX}, new y: ${newY}`);

    // check for out of bounds
    if (this.x + newX > mapWidthScaled) {
      newX = mapWidthScaled - this.x;
    } else if (this.x + newX < 0) {
      newX = this.x;
    } else {
      //
    }
    if (this.y + newY > mapHeightScaled) {
      newY = mapHeightScaled - this.y;
    } else if (this.y + newY < 0) {
      newY = this.y;
    } else {
      //
    }

    this.x += newX;
    this.y += newY;
    console.log(`POST this.x: ${this.x}, this.y: ${this.y}`);
    console.log(`POST new x: ${newX}, new y: ${newY}`);
    // there is logic in each if statement to also provide if logic on whether or not the monster goes out of bounds
    // 1 - 90 degrees

    if (this.x > 3840 || this.y > 3840) {
      console.log('monster on the run');
      console.log(`degrees: ${randomAngle} - x: ${this.x}, (newX): ${newX} y: ${this.y}, (newY): ${newY}, distance: ${distance}`);
    }
  }
}
