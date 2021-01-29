class ChestModel {
  constructor(x,y,bitcoin,spawnerId) {
    this.id = `${spawnerId}-${uuid.v4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.bitcoin = bitcoin;
  }
}