// container player information like health and balance
export default class PlayerModel {
  constructor(playerId, spawnLocations, players, username, frame) {
    this.attack = 10;
    this.health = 100;
    this.maxHealth = 100;
    this.defense = 2;
    this.bitcoin = 0;
    this.id = playerId;
    this.spawnLocations = spawnLocations;
    this.flipX = true;
    this.playerAttacking = false;
    // this.currentDirection = ;
    const location = this.generateLocation(players);
    // short hand to set 2 values 1st and 2nd item of location array
    [this.x, this.y] = location;
    this.username = username;
    this.frame = frame;
    this.playerItems = {};
    this.maxNumberOfItems = 3;
  }

  canPickupItem() {
    if (Object.keys(this.playerItems).length < this.maxNumberOfItems) {
      return false;
    }
    return true;
  }

  addItem(item) {
    this.playerItems[item.id] = item;
  }

  removeItem(item) {
    delete this.playerItems[item.id];
  }

  playerAttacked(attack) {
    let damage = attack - this.defense;
    if (damage < 0) damage = 0;
    this.updateHealth(damage);
    // console.log(attack);
    // console.log(damage);
  }

  updateBitcoin(bitcoin) {
    this.bitcoin += bitcoin;
  }

  updateHealth(damage) {
    this.health -= damage;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  respawn(players) {
    this.health = this.maxHealth;
    const location = this.generateLocation(players);
    [this.x, this.y] = location;
  }

  generateLocation(players) {
    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    const invalidLocation = Object.keys(players).some((key) => {
      if (players[key].x === location[0] && players[key].y === location[1]) {
        return true;
      }
      return false;
    });
    if (invalidLocation) {
      return this.generateLocation(players);
    }
    return location;
  }
}
