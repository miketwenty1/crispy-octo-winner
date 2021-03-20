// container player information like health and balance
export default class PlayerModel {

  static maxItems = 3;
  static maxHealth = 100;

  constructor(socketId, username, character) {
    this.socketId = socketId;
    this.username = username;
    this.character = character; // aka frame

    this.attrs = {
      health: PlayerModel.maxHealth,
      attack: 10,
      defense: 2,
    };

    this.coord = {
      x: 0,
      y: 0,
    };

    this.coins = 0;
    this.items = {};
  }

  static create(socketId, username, character) {
    return new PlayerModel(socketId, username, character);
  }

  respawn() {
    this.updateAttrs('health', PlayerModel.maxHealth);
    this.updateCoord(0, 0);
  }

  updateAttrs(key, value) {
    this.attrs.{key} += value;
  }

  updateCoord(x, y) {
    this.coord = {
      x: x,
      y: y,
    };
  }

  updateCoins(amount) {
    this.coins += amount;
  }

  updateItems(item, action='delete') {
    if (action === 'delete') {
      delete this.items[item.id];
    } else {
      this.items[item.id] = item;
    }
  }
}
