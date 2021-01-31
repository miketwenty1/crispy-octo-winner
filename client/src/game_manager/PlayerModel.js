import { v4 } from 'uuid';

export default class PlayerModel {
  constructor(spawnLocations) {
    this.health = 100;
    this.maxHealth = 100;
    this.bitcoin = 0;
    this.id = `player-${v4()}`;
    this.spawnLocations = spawnLocations;

    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    // short hand to set 2 values 1st and 2nd item of location array
    [this.x, this.y] = location;
  }

  updateBitcoin(bitcoin) {
    this.bitcoin += bitcoin;
  }

  updateHealth(damage) {
    this.health -= damage;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
    // console.log('damage was '+damage+ ', now health is '+this.health);
  }

  respawn() {
    this.health = this.maxHealth;
    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    [this.x, this.y] = location;
  }
}
